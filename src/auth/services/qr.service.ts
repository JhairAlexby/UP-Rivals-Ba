import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  /**
   * Genera un código QR visual en formato base64
   * @param data - Datos a codificar en el QR
   * @param options - Opciones de personalización del QR
   * @returns Promise<string> - QR en formato base64
   */
  async generateQRCode(
    data: string,
    options?: {
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  ): Promise<string> {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, defaultOptions);
      return qrCodeDataURL;
    } catch (error) {
      throw new Error(`Error generando código QR: ${error.message}`);
    }
  }

  /**
   * Genera un código QR para un usuario específico
   * @param userId - ID del usuario
   * @param userQrCode - Código QR único del usuario
   * @returns Promise<string> - QR visual en base64
   */
  async generateUserQRCode(userId: string, userQrCode: string): Promise<string> {
    const qrData = {
      type: 'USER_INVITE',
      userId,
      qrCode: userQrCode,
      timestamp: Date.now()
    };

    return this.generateQRCode(JSON.stringify(qrData), {
      width: 300,
      color: {
        dark: '#1a365d', // Azul oscuro
        light: '#ffffff'
      }
    });
  }

  /**
   * Valida y extrae datos de un código QR escaneado
   * @param qrData - Datos del QR escaneado
   * @returns Objeto con los datos del usuario o null si es inválido
   */
  validateQRData(qrData: string): { userId: string; qrCode: string } | null {
    try {
      const parsed = JSON.parse(qrData);
      
      if (parsed.type === 'USER_INVITE' && parsed.userId && parsed.qrCode) {
        return {
          userId: parsed.userId,
          qrCode: parsed.qrCode
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}