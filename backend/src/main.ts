import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit'
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
	dotenv.config();

	const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });

	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT || 3000;

	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutos
			max: 100, // Limita a 100 solicitudes por IP en el periodo
			message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
		}),
	);

	// Configurar CORS con más detalles
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, 
    maxAge: 86400,
  });

	await app.listen(port, '0.0.0.0');
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
