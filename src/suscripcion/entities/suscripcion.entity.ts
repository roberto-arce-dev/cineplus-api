export class Suscripcion {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Suscripcion>) {
    Object.assign(this, partial);
  }
}
