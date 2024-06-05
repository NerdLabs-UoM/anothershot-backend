import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import rawBodyMiddleware from './stripe/rawBody.middleware';

// Bootstrap the NestJS application
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    logger.log('Nest application created');

    app.enableCors();
    logger.log('CORS enabled');

    app.use(rawBodyMiddleware());
    logger.log('Raw body middleware applied');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }));
    logger.log('Global validation pipe applied');

    await app.listen(8000);
    logger.log('Application is listening on port 8000');
  } catch (error) {
    logger.error('Error during bootstrap', error.stack);
  }
}

bootstrap();
