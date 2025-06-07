import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<Omit<User, 'password'>> {
    const { name, email, password, phone, role } = createAuthDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = this.userRepository.create({ name, email, password: passwordHash, phone, role, isActive: true });
    try {
      await this.userRepository.save(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) { throw new NotFoundException(`User with ID "${id}" not found`);}
    if (updateAuthDto.password) {
      const saltRounds = 10;
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, saltRounds);
    }
    Object.assign(user, updateAuthDto);
    try {
      await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === '23505') { throw new ConflictException('Email already exists'); }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) { throw new NotFoundException(`User with ID "${id}" not found`); }
    try {
      await this.userRepository.remove(user);
      return { message: `User with ID "${id}" successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) { throw new NotFoundException(`User with ID "${id}" not found`); }
    if (!user.isActive) { return { message: `User with ID "${id}" is already inactive` }; }
    user.isActive = false;
    try {
      await this.userRepository.save(user);
      return { message: `User with ID "${id}" successfully deactivated (soft deleted)` };
    } catch (error) {
      throw new InternalServerErrorException('Error performing soft delete');
    }
  }
  
  async login(loginAuthDto: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = loginAuthDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
