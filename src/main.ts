import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
                                      // liberado acesso externo
  const app = await NestFactory.create(AppModule, { cors: true });
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
