import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException('Datos de entrada inválidos: ' + JSON.stringify(errors));
    }

    const { name, email, password, role } = registerDto;
    const user = new this.userModel({ name, email, password, role });
    await user.save();

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: { id: string; name: string } }> {
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      throw new BadRequestException('Datos de entrada inválidos: ' + JSON.stringify(errors));
    }

    const { email, password } = loginDto;
		//console.log('Voy a buscar el email ', email)
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
		const isMatch = await user.comparePassword(password);
		//console.log(isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
			user: {
        id: user.id.toString(), // Convert ObjectId to string for the frontend
        name: user.name,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }
}