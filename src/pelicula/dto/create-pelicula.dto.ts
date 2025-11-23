import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePeliculaDto {
  @ApiProperty({
    example: 'Nombre del Pelicula',
    description: 'Nombre del Pelicula',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Descripción del Pelicula',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
