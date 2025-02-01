#### 01 Apps Ferramentas
* nodejs
* vscode

#### 02 Plugins
* Prisma
* Prisma Insider
* Prisma Import

* Client plugin

<hr />

#### 03 Criando Api Nest
```
npx nest new app03
```

#### 04 Dependências PRISMA ORM
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

<hr />
<br />

<summary> <h3> 05 Criando o prisma.service.ts </h3> </summary>

<details>

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
</details>

<hr />
  
<summary> <h3> 06 editar o db.module.ts </h3> </summary>

<details>

  ```
  import { Module } from '@nestjs/common';
  import { PrismaService } from './prisma.service'; 

  @Module({
      providers: [PrismaService],
      exports: [PrismaService]
  })
  export class DbModule {}
```

</details>

<hr />

<summary> <h3> 07 prisma/shema.prisma </h3> </summary>

<details>

  * modelo de conexão com postgrees :: exemplo com supabase
  ```
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```
</details>

<hr />

<summary> <h3> 08 Primeiro Entidade Produto </h3> </summary>

<details>

  ```
  model Produto {
    id     Int     @default(autoincrement()) @id
    nome   String  @unique
    preco  Float
  }
  ```
</details>

<hr />

<summary> <h3> 09 configurando .env </h3> </summary>

<details>

  * exempo env POSTGRESQL e supabase
  ```
  DATABASE_URL=""

  DIRECT_URL=""
  ```
</details>

<hr />

<summary> <h3> 10 Primeiro Migrate </h3> </summary>

<details>
```
npx prisma migrate dev
```

</details>

<hr />

<summary> <h3> 11 Criando primeira entidade Crud ( Produto ) </h3> </summary>

<details>

  ```
  npx nest g res produto --no-spec
  ```

  * selecionar REST API
  *  Would you like to generate CRUD entry points? (Y/n)  Marcar  ( Y )

</details>

<hr />

<summary> <h3> 12 Atualizando Modulos </h3> </summary>

<details>

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

  * Modulo app.module.ts precisa conhecer o modulo --> db.module.ts

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
</details>

<hr />

<summary> <h3> 13 Implementar DTO produto </h3> </summary>

<details>

  * create-produto.dto.ts
  ```
  export class CreateProdutoDto {
      nome: string;
      preco: number;
  }
  ```

  * update-produto.dto.ts
  ```
  import { CreateProdutoDto } from './create-produto.dto';

  export interface UpdateProdutoDto extends Partial<CreateProdutoDto> {
      id : number 
  }
  ```

</details>

<hr />

<summary> <h3> 14 Implementando produto.service.ts </h3> </summary>

  <details>
   
    ```
      import { Injectable } from '@nestjs/common';
      import { CreateProdutoDto } from './dto/create-produto.dto';
      import { UpdateProdutoDto } from './dto/update-produto.dto';
      import { PrismaService } from 'src/db/prisma.service'; 
      import { error } from 'console';

      /** Produto Service
      *   Instanciando nossa base de dados com PrismaService
      *   Vamos criar *** 6 *** Metodos Curinga para o dia a dia
      */

      @Injectable()
      export class ProdutoService {

        // Criando uma instancia do prismaService
        // prismaService tem todas referências das tabelas.
        constructor(private readonly prismaService: PrismaService){}

        // #01 Criando nosso create metodo responsável por inserir na tabela.
        // Verfica se existe antes
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

        // #02 Listando todos os produtos
        findAll() {
          return this.prismaService.produto.findMany();
        }

        // #03 Listando por ID
        findOne(id: number) {
          return this.prismaService.produto.findUnique({
            where: { id }
          });
        }

        // #04 Listando por Nome
        findName(nome: string) {
          return this.prismaService.produto.findUnique({
            where: { nome }
          });
        }

        // #05 Atualizar produto por id conferir se existe antes de atualizar
        async update(id: number, updateProdutoDto: UpdateProdutoDto) {
          
          const existeProduto = await this.prismaService.produto.findUnique({
            where: { id }
          })

          if(!existeProduto){
            throw new error( "Erro já existe esse produto " + id )
          }
          
          return this.prismaService.produto.update({
            where: { id },
            data: updateProdutoDto
          });
        }

        // #06 Deletar produto por id conferir se existe antes de apagar
        async remove(id: number) {
          const existeProduto = await this.prismaService.produto.findUnique({
            where: { id }
          })

          if(!existeProduto){
            throw new error( "Erro produto não existe esse produto " + id )
          }
          
          return this.prismaService.produto.delete({
            where: { id },
          });
        }
      }
    ```
</details>

<hr />

<summary> <h3> 15 Atualizar o main.ts </h3> </summary>
<details>

  * podemos mudar a porta de conexão.
  * liberar o acesso externo pelo cors
  
  ```
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app/app.module';

  async function bootstrap() {
                                        // liberado acesso externo
    const app = await NestFactory.create(AppModule, { cors: true });
    
    await app.listen(process.env.PORT ?? 8080);
  }
  bootstrap();
  ```
</details>

<summary> <h3> 16 Rodando projeto </h3> </summary>
  <details>

  ```
  npm run start:dev
  ```
</details>

<hr />

<summary> <h3> 17 Testando rotas Rest ( Client plugin ) </h3> </summary>
  <details>
 
  ```
  ###
  GET http://localhost:8080/produto

  ###
  GET http://localhost:8080/produto/1

  ###
  DELETE http://localhost:8080/produto/2

  ###
  POST http://localhost:8080/produto
  Content-Type: application/json

  {
      "nome": "Xiaomi X-3 pro",
      "preco": 1900
  }

  ###
  PATCH http://localhost:8080/produto/1
  Content-Type: application/json

  {
      "nome": "tv 43",
      "preco": 250
  }

  ```
  </details>