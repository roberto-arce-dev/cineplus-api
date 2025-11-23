import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { UpdateLicenciaDto } from './dto/update-licencia.dto';
import { Licencia, LicenciaDocument } from './schemas/licencia.schema';

@Injectable()
export class LicenciaService {
  constructor(
    @InjectModel(Licencia.name) private licenciaModel: Model<LicenciaDocument>,
  ) {}

  async create(createLicenciaDto: CreateLicenciaDto): Promise<Licencia> {
    const nuevoLicencia = await this.licenciaModel.create(createLicenciaDto);
    return nuevoLicencia;
  }

  async findAll(): Promise<Licencia[]> {
    const licencias = await this.licenciaModel.find();
    return licencias;
  }

  async findOne(id: string | number): Promise<Licencia> {
    const licencia = await this.licenciaModel.findById(id)
    .populate('pelicula', 'titulo director');
    if (!licencia) {
      throw new NotFoundException(`Licencia con ID ${id} no encontrado`);
    }
    return licencia;
  }

  async update(id: string | number, updateLicenciaDto: UpdateLicenciaDto): Promise<Licencia> {
    const licencia = await this.licenciaModel.findByIdAndUpdate(id, updateLicenciaDto, { new: true })
    .populate('pelicula', 'titulo director');
    if (!licencia) {
      throw new NotFoundException(`Licencia con ID ${id} no encontrado`);
    }
    return licencia;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.licenciaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Licencia con ID ${id} no encontrado`);
    }
  }
}
