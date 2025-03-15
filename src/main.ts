import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with wildcard configuration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 9999;
  await app.listen(port);
}
bootstrap();
