import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntradaService } from './entrada.service';
import { EntradaController } from './entrada.controller';
import { UploadModule } from '../upload/upload.module';
import { Entrada, EntradaSchema } from './schemas/entrada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entrada.name, schema: EntradaSchema }]),
    UploadModule,
  ],
  controllers: [EntradaController],
  providers: [EntradaService],
  exports: [EntradaService],
})
export class EntradaModule {}
