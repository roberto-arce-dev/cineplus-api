import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PeliculaDocument = Pelicula & Document;

@Schema({ timestamps: true })
export class Pelicula {
  @Prop({ required: true })
  titulo: string;

  @Prop()
  director?: string;

  @Prop()
  genero?: string;

  @Prop({ min: 0 })
  duracion?: number;

  @Prop()
  sinopsis?: string;

  @Prop()
  poster?: string;

  @Prop()
  trailer?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PeliculaSchema = SchemaFactory.createForClass(Pelicula);

PeliculaSchema.index({ titulo: 'text', sinopsis: 'text' });
PeliculaSchema.index({ genero: 1 });
