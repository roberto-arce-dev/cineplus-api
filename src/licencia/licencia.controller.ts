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
import { LicenciaService } from './licencia.service';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { UpdateLicenciaDto } from './dto/update-licencia.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Licencia')
@ApiBearerAuth('JWT-auth')
@Controller('licencia')
export class LicenciaController {
  constructor(
    private readonly licenciaService: LicenciaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Licencia' })
  @ApiBody({ type: CreateLicenciaDto })
  @ApiResponse({ status: 201, description: 'Licencia creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createLicenciaDto: CreateLicenciaDto) {
    const data = await this.licenciaService.create(createLicenciaDto);
    return {
      success: true,
      message: 'Licencia creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Licencia' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Licencia' })
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
  @ApiResponse({ status: 404, description: 'Licencia no encontrado' })
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
    const updated = await this.licenciaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { licencia: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Licencias' })
  @ApiResponse({ status: 200, description: 'Lista de Licencias' })
  async findAll() {
    const data = await this.licenciaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Licencia por ID' })
  @ApiParam({ name: 'id', description: 'ID del Licencia' })
  @ApiResponse({ status: 200, description: 'Licencia encontrado' })
  @ApiResponse({ status: 404, description: 'Licencia no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.licenciaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Licencia' })
  @ApiParam({ name: 'id', description: 'ID del Licencia' })
  @ApiBody({ type: UpdateLicenciaDto })
  @ApiResponse({ status: 200, description: 'Licencia actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Licencia no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateLicenciaDto: UpdateLicenciaDto
  ) {
    const data = await this.licenciaService.update(id, updateLicenciaDto);
    return {
      success: true,
      message: 'Licencia actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Licencia' })
  @ApiParam({ name: 'id', description: 'ID del Licencia' })
  @ApiResponse({ status: 200, description: 'Licencia eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Licencia no encontrado' })
  async remove(@Param('id') id: string) {
    const licencia = await this.licenciaService.findOne(id);
    if (licencia.imagen) {
      const filename = licencia.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.licenciaService.remove(id);
    return { success: true, message: 'Licencia eliminado exitosamente' };
  }
}
