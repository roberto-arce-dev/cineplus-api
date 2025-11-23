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
import { SuscripcionService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Suscripcion')
@ApiBearerAuth('JWT-auth')
@Controller('suscripcion')
export class SuscripcionController {
  constructor(
    private readonly suscripcionService: SuscripcionService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Suscripcion' })
  @ApiBody({ type: CreateSuscripcionDto })
  @ApiResponse({ status: 201, description: 'Suscripcion creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createSuscripcionDto: CreateSuscripcionDto) {
    const data = await this.suscripcionService.create(createSuscripcionDto);
    return {
      success: true,
      message: 'Suscripcion creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Suscripcion' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Suscripcion' })
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
  @ApiResponse({ status: 404, description: 'Suscripcion no encontrado' })
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
    const updated = await this.suscripcionService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { suscripcion: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Suscripcions' })
  @ApiResponse({ status: 200, description: 'Lista de Suscripcions' })
  async findAll() {
    const data = await this.suscripcionService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Suscripcion por ID' })
  @ApiParam({ name: 'id', description: 'ID del Suscripcion' })
  @ApiResponse({ status: 200, description: 'Suscripcion encontrado' })
  @ApiResponse({ status: 404, description: 'Suscripcion no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.suscripcionService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Suscripcion' })
  @ApiParam({ name: 'id', description: 'ID del Suscripcion' })
  @ApiBody({ type: UpdateSuscripcionDto })
  @ApiResponse({ status: 200, description: 'Suscripcion actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Suscripcion no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateSuscripcionDto: UpdateSuscripcionDto
  ) {
    const data = await this.suscripcionService.update(id, updateSuscripcionDto);
    return {
      success: true,
      message: 'Suscripcion actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Suscripcion' })
  @ApiParam({ name: 'id', description: 'ID del Suscripcion' })
  @ApiResponse({ status: 200, description: 'Suscripcion eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Suscripcion no encontrado' })
  async remove(@Param('id') id: string) {
    const suscripcion = await this.suscripcionService.findOne(id);
    if (suscripcion.imagen) {
      const filename = suscripcion.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.suscripcionService.remove(id);
    return { success: true, message: 'Suscripcion eliminado exitosamente' };
  }
}
