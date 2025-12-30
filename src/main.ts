import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "dotenv/config";
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["*", "http://localhost:5173",],
    credentials: true
  }),
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // ✅ converts string -> number automatically
      },
      exceptionFactory: (errors) => {
        const firstError = errors[0]
        const constraints = firstError?.constraints
        const firstMessage = constraints ? Object.values(constraints)?.[0] : 'Validation Failed'
        throw new BadRequestException(firstMessage)
      }
    }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
