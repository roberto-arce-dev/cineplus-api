import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EntradaDocument = Entrada & Document;

@Schema({ timestamps: true })
export class Entrada {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pelicula', required: true })
  pelicula: Types.ObjectId;

  @Prop()
  funcion?: string;

  @Prop()
  asiento?: string;

  @Prop({ min: 0 })
  precio: number;

  @Prop({ default: Date.now })
  fechaCompra?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EntradaSchema = SchemaFactory.createForClass(Entrada);

EntradaSchema.index({ usuario: 1 });
EntradaSchema.index({ pelicula: 1 });
EntradaSchema.index({ fechaCompra: -1 });
