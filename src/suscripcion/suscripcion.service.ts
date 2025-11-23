import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { Suscripcion, SuscripcionDocument } from './schemas/suscripcion.schema';

@Injectable()
export class SuscripcionService {
  constructor(
    @InjectModel(Suscripcion.name) private suscripcionModel: Model<SuscripcionDocument>,
  ) {}

  async create(createSuscripcionDto: CreateSuscripcionDto): Promise<Suscripcion> {
    const nuevoSuscripcion = await this.suscripcionModel.create(createSuscripcionDto);
    return nuevoSuscripcion;
  }

  async findAll(): Promise<Suscripcion[]> {
    const suscripcions = await this.suscripcionModel.find();
    return suscripcions;
  }

  async findOne(id: string | number): Promise<Suscripcion> {
    const suscripcion = await this.suscripcionModel.findById(id)
    .populate('usuario', 'nombre email');
    if (!suscripcion) {
      throw new NotFoundException(`Suscripcion con ID ${id} no encontrado`);
    }
    return suscripcion;
  }

  async update(id: string | number, updateSuscripcionDto: UpdateSuscripcionDto): Promise<Suscripcion> {
    const suscripcion = await this.suscripcionModel.findByIdAndUpdate(id, updateSuscripcionDto, { new: true })
    .populate('usuario', 'nombre email');
    if (!suscripcion) {
      throw new NotFoundException(`Suscripcion con ID ${id} no encontrado`);
    }
    return suscripcion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.suscripcionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Suscripcion con ID ${id} no encontrado`);
    }
  }
}
