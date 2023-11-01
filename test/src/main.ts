import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://nhadattamsinhphat.vn',
      'http://admin.nhadattamsinhphat.vn',
    ],
  });
  await app.listen(3000);
}
bootstrap();
