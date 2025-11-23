import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula, PeliculaDocument } from './schemas/pelicula.schema';

@Injectable()
export class PeliculaService {
  constructor(
    @InjectModel(Pelicula.name) private peliculaModel: Model<PeliculaDocument>,
  ) {}

  async create(createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
    const nuevoPelicula = await this.peliculaModel.create(createPeliculaDto);
    return nuevoPelicula;
  }

  async findAll(): Promise<Pelicula[]> {
    const peliculas = await this.peliculaModel.find();
    return peliculas;
  }

  async findOne(id: string | number): Promise<Pelicula> {
    const pelicula = await this.peliculaModel.findById(id)
    .populate('licencia', 'tipo fechaInicio fechaFin');
    if (!pelicula) {
      throw new NotFoundException(`Pelicula con ID ${id} no encontrado`);
    }
    return pelicula;
  }

  async update(id: string | number, updatePeliculaDto: UpdatePeliculaDto): Promise<Pelicula> {
    const pelicula = await this.peliculaModel.findByIdAndUpdate(id, updatePeliculaDto, { new: true })
    .populate('licencia', 'tipo fechaInicio fechaFin');
    if (!pelicula) {
      throw new NotFoundException(`Pelicula con ID ${id} no encontrado`);
    }
    return pelicula;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.peliculaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Pelicula con ID ${id} no encontrado`);
    }
  }
}
