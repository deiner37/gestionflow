import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto } from './../auth/dto/create-user.dto';
import { UpdateUserDto } from './../auth/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('id') id: string, @Request() req: any): Promise<User> {
    const userId = req.user.userId; // Assumes the JWT token contains userId
    if (req.user.role === Role.User && userId !== id) {
      throw new UnauthorizedException('You do not have permission to view this user.');
    }
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.User)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any): Promise<User> {
    const userId = req.user.userId;
    if (req.user.role === Role.User && userId !== id) {
      throw new UnauthorizedException('You do not have permission to update this user.');
    }
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.remove(id);
  }
}