import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serverless from 'serverless-http';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('The auth API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();

    return serverless(app.getHttpAdapter().getInstance());
}

export const handler = bootstrap();
