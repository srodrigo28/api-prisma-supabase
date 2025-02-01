#### Apps Ferramentas
* nodejs
* vscode

#### Plugins
* Prisma
* Prisma Insider
* Prisma Import

* Client plugin

<hr />
#### Criando Api Nest
```
npx nest new app03
```

#### Dependências
```
npm install prisma --save-dev
```

```
npx prisma init
```

```
npm install @prisma/client
```

```
npx nest g module db
```

#### criar o prismaService
```
import { Global, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect();
    }
}
```

#### editar o db.module.ts
```
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; 

@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class DbModule {}
```

#### Criando primeira entidade
```
npx nest g res produto --no-spec
```

#### Atualizando Modulos

* Modulo Produto precisa conhecer o db.module.ts que é a conexão
```
import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
```

* Modulo app.module.ts precisa conhecer o db.module.ts

```
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

```

#### Partil produto.service.ts
```
import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/db/prisma.service'; 
import { error } from 'console';

@Injectable()
export class ProdutoService {
  constructor(private readonly prismaService: PrismaService){}

 async create(createProdutoDto: CreateProdutoDto) {
    const produtoExist = await this.prismaService.produto.findUnique({
      where: { nome: createProdutoDto.nome}
    })

    if(produtoExist){
      throw error("Esse produto já existe: " + createProdutoDto.nome)
    }

    return this.prismaService.produto.create({
      data: createProdutoDto,
    })
  }

  findAll() {
    return this.prismaService.produto.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} produto`;
  }

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return `This action updates a #${id} produto`;
  }

  remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
```

#### Rodando projeto
```
npm run start:dev
```

#### Testando rotas Rest ( Client plugin )
* Criando arquivo produto.http
```
GET http://localhost:8080/produto

###
POST http://localhost:8080/produto
Content-Type: application/json

{
    "nome": "Sousa Oliveira",
    "preco": 200
}
```