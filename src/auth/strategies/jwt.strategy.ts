import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService, 
  ) {
    
    const secret = configService.get<string>('JWT_SECRET');

    
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is not set in environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
