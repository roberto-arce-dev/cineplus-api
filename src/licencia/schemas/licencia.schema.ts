import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LicenciaDocument = Licencia & Document;

@Schema({ timestamps: true })
export class Licencia {
  @Prop({ type: Types.ObjectId, ref: 'Pelicula', required: true,  unique: true  })
  pelicula: Types.ObjectId;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ enum: ['streaming', 'cine', 'ambos'], default: 'streaming' })
  tipo?: string;

  @Prop({ default: 0, min: 0 })
  precio?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const LicenciaSchema = SchemaFactory.createForClass(Licencia);

LicenciaSchema.index({ pelicula: 1 });
LicenciaSchema.index({ tipo: 1 });
