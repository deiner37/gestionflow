import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/upiapp'),
    UsersModule,
    AuthModule,
    ProductsModule,
    InvoicesModule,
		
  ],
  //controllers: [AppController],
  providers: [{
		provide: 'APP_FILTER',
		useClass: AllExceptionsFilter,
	}],
})
export class AppModule {}
