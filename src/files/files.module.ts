import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'Cloudinary';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: CLOUDINARY,
      useFactory: (configService: ConfigService) => {
        const cloudName = configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = configService.get('CLOUDINARY_API_KEY');
        const apiSecret = configService.get('CLOUDINARY_API_SECRET');

        if (!cloudName) throw new Error('CLOUDINARY_CLOUD_NAME is not set in environment variables.');
        if (!apiKey) throw new Error('CLOUDINARY_API_KEY is not set in environment variables.');
        if (!apiSecret) throw new Error('CLOUDINARY_API_SECRET is not set in environment variables.');

        // Configurar Cloudinary globalmente
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        // Devolver la instancia de cloudinary
        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
  exports: [FilesService, CLOUDINARY], // Exportar también CLOUDINARY si lo necesitas en otros módulos
})
export class FilesModule {}