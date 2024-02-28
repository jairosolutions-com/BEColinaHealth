import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from the specified origin
    credentials: true, // Allow sending cookies
  });
  await app.listen(3000);
}
bootstrap();
