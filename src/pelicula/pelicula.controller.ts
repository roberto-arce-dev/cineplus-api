import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PeliculaService } from './pelicula.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Pelicula')
@ApiBearerAuth('JWT-auth')
@Controller('pelicula')
export class PeliculaController {
  constructor(
    private readonly peliculaService: PeliculaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Pelicula' })
  @ApiBody({ type: CreatePeliculaDto })
  @ApiResponse({ status: 201, description: 'Pelicula creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPeliculaDto: CreatePeliculaDto) {
    const data = await this.peliculaService.create(createPeliculaDto);
    return {
      success: true,
      message: 'Pelicula creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Pelicula' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Pelicula' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Pelicula no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.peliculaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { pelicula: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Peliculas' })
  @ApiResponse({ status: 200, description: 'Lista de Peliculas' })
  async findAll() {
    const data = await this.peliculaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Pelicula por ID' })
  @ApiParam({ name: 'id', description: 'ID del Pelicula' })
  @ApiResponse({ status: 200, description: 'Pelicula encontrado' })
  @ApiResponse({ status: 404, description: 'Pelicula no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.peliculaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Pelicula' })
  @ApiParam({ name: 'id', description: 'ID del Pelicula' })
  @ApiBody({ type: UpdatePeliculaDto })
  @ApiResponse({ status: 200, description: 'Pelicula actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pelicula no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePeliculaDto: UpdatePeliculaDto
  ) {
    const data = await this.peliculaService.update(id, updatePeliculaDto);
    return {
      success: true,
      message: 'Pelicula actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Pelicula' })
  @ApiParam({ name: 'id', description: 'ID del Pelicula' })
  @ApiResponse({ status: 200, description: 'Pelicula eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pelicula no encontrado' })
  async remove(@Param('id') id: string) {
    const pelicula = await this.peliculaService.findOne(id);
    if (pelicula.imagen) {
      const filename = pelicula.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.peliculaService.remove(id);
    return { success: true, message: 'Pelicula eliminado exitosamente' };
  }
}
