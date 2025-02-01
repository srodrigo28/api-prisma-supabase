import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from 'src/db/db.module';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  imports: [DbModule, ProdutoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
