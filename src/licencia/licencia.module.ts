import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LicenciaService } from './licencia.service';
import { LicenciaController } from './licencia.controller';
import { UploadModule } from '../upload/upload.module';
import { Licencia, LicenciaSchema } from './schemas/licencia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Licencia.name, schema: LicenciaSchema }]),
    UploadModule,
  ],
  controllers: [LicenciaController],
  providers: [LicenciaService],
  exports: [LicenciaService],
})
export class LicenciaModule {}
