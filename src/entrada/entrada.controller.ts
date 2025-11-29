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
import { EntradaService } from './entrada.service';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Entrada')
@ApiBearerAuth('JWT-auth')
@Controller('entrada')
export class EntradaController {
  constructor(
    private readonly entradaService: EntradaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Entrada' })
  @ApiBody({ type: CreateEntradaDto })
  @ApiResponse({ status: 201, description: 'Entrada creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createEntradaDto: CreateEntradaDto) {
    const data = await this.entradaService.create(createEntradaDto);
    return {
      success: true,
      message: 'Entrada creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Entrada' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Entrada' })
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
  @ApiResponse({ status: 404, description: 'Entrada no encontrado' })
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
    const updated = await this.entradaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { entrada: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Entradas' })
  @ApiResponse({ status: 200, description: 'Lista de Entradas' })
  async findAll() {
    const data = await this.entradaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Entrada por ID' })
  @ApiParam({ name: 'id', description: 'ID del Entrada' })
  @ApiResponse({ status: 200, description: 'Entrada encontrado' })
  @ApiResponse({ status: 404, description: 'Entrada no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.entradaService.findOne(id);
    return { success: true, data };
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener entradas de un usuario' })
  async findByUsuario(@Param('usuarioId') usuarioId: string) {
    const data = await this.entradaService.findByUsuario(usuarioId);
    return { success: true, data, total: data.length };
  }

  @Post('comprar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comprar entrada para película' })
  async comprarEntrada(@Body() entradaDto: any) {
    const data = await this.entradaService.comprarEntrada(entradaDto);
    return { success: true, message: 'Entrada comprada exitosamente', data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Entrada' })
  @ApiParam({ name: 'id', description: 'ID del Entrada' })
  @ApiBody({ type: UpdateEntradaDto })
  @ApiResponse({ status: 200, description: 'Entrada actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrada no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateEntradaDto: UpdateEntradaDto
  ) {
    const data = await this.entradaService.update(id, updateEntradaDto);
    return {
      success: true,
      message: 'Entrada actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Entrada' })
  @ApiParam({ name: 'id', description: 'ID del Entrada' })
  @ApiResponse({ status: 200, description: 'Entrada eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrada no encontrado' })
  async remove(@Param('id') id: string) {
    const entrada = await this.entradaService.findOne(id);
    if (entrada.imagen) {
      const filename = entrada.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.entradaService.remove(id);
    return { success: true, message: 'Entrada eliminado exitosamente' };
  }
}
