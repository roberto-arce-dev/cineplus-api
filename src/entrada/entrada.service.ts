import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { Entrada, EntradaDocument } from './schemas/entrada.schema';

@Injectable()
export class EntradaService {
  constructor(
    @InjectModel(Entrada.name) private entradaModel: Model<EntradaDocument>,
  ) {}

  async create(createEntradaDto: CreateEntradaDto): Promise<Entrada> {
    const nuevoEntrada = await this.entradaModel.create(createEntradaDto);
    return nuevoEntrada;
  }

  async findAll(): Promise<Entrada[]> {
    const entradas = await this.entradaModel.find();
    return entradas;
  }

  async findOne(id: string | number): Promise<Entrada> {
    const entrada = await this.entradaModel.findById(id)
    .populate('usuario', 'nombre email')
    .populate('pelicula', 'titulo genero duracion');
    if (!entrada) {
      throw new NotFoundException(`Entrada con ID ${id} no encontrado`);
    }
    return entrada;
  }

  async update(id: string | number, updateEntradaDto: UpdateEntradaDto): Promise<Entrada> {
    const entrada = await this.entradaModel.findByIdAndUpdate(id, updateEntradaDto, { new: true })
    .populate('usuario', 'nombre email')
    .populate('pelicula', 'titulo genero duracion');
    if (!entrada) {
      throw new NotFoundException(`Entrada con ID ${id} no encontrado`);
    }
    return entrada;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.entradaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Entrada con ID ${id} no encontrado`);
    }
  }
  async findByUsuario(usuarioId: string): Promise<Entrada[]> {
    return this.entradaModel.find({ usuario: usuarioId });
  }
  async comprarEntrada(dto: any): Promise<Entrada> {
    const entrada = await this.entradaModel.create(dto);
    return entrada;
  }


}
