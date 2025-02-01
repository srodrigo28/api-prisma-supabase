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