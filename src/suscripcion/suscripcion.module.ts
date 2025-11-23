import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { UploadModule } from '../upload/upload.module';
import { Suscripcion, SuscripcionSchema } from './schemas/suscripcion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Suscripcion.name, schema: SuscripcionSchema }]),
    UploadModule,
  ],
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}
