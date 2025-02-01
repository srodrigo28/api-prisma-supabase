import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/db/prisma.service'; 
import { error } from 'console';

/** ### Produto Service ###
 *  Instanciando nossa base de dados com PrismaService
 *  Vamos criar *** 6 *** Metodos Curinga para o dia a dia
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