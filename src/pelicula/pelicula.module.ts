import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PeliculaService } from './pelicula.service';
import { PeliculaController } from './pelicula.controller';
import { UploadModule } from '../upload/upload.module';
import { Pelicula, PeliculaSchema } from './schemas/pelicula.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pelicula.name, schema: PeliculaSchema }]),
    UploadModule,
  ],
  controllers: [PeliculaController],
  providers: [PeliculaService],
  exports: [PeliculaService],
})
export class PeliculaModule {}
