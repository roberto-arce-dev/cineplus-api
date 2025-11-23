import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SuscripcionDocument = Suscripcion & Document;

@Schema({ timestamps: true })
export class Suscripcion {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true,  unique: true  })
  usuario: Types.ObjectId;

  @Prop({ enum: ['basica', 'premium', 'vip'], default: 'basica' })
  tipo?: string;

  @Prop({ min: 0 })
  precio: number;

  @Prop({ default: Date.now })
  fechaInicio?: Date;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ enum: ['activa', 'pausada', 'cancelada'], default: 'activa' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const SuscripcionSchema = SchemaFactory.createForClass(Suscripcion);

SuscripcionSchema.index({ usuario: 1 });
SuscripcionSchema.index({ estado: 1 });
