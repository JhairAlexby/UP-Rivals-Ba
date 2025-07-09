import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { QrService } from './services/qr.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly qrService: QrService,
  ) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // --- ENDPOINT NUEVO AÑADIDO ---
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Protegemos la ruta, solo usuarios logueados pueden acceder
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Patch('soft-delete/:id')
  @UseGuards(AuthGuard('jwt'))
  softDelete(@Param('id') id: string) {
    return this.authService.softDelete(id);
  }

  // --- ENDPOINTS QR AÑADIDOS ---
  @Get('qr/my-code')
  @UseGuards(AuthGuard('jwt'))
  async getMyQRCode(@GetUser() user: User) {
    if (!user.qrCode) {
      throw new NotFoundException('Usuario no tiene código QR generado');
    }
    
    const qrCodeImage = await this.qrService.generateUserQRCode(user.id, user.qrCode);
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      qrCode: user.qrCode,
      qrCodeImage, // Base64 image
    };
  }

  @Get('qr/find-user')
  @UseGuards(AuthGuard('jwt'))
  async findUserByQR(@Query('qrCode') qrCode: string) {
    return this.authService.findUserByQRCode(qrCode);
  }
}
