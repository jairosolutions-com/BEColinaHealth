import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: process.env.FE_URL, // Allow requests from this origin
    credentials: true, // Optional: If you need to send cookies with the request
  };
  app.enableCors(corsOptions);

  // Enable CORS with the specified options

  await app.listen(3000);
}
bootstrap();
