import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      const token = this.getJwtToken({ id: user.id });
      return { ...user, token };
    } catch (e) {
      this.handleError(e);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) throw new UnauthorizedException('Credentials not valid');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials not valid');

      const token = this.getJwtToken({ id: user.id });
      return { ...user, token };
    } catch (e) {
      this.handleError(e);
    }
  }

  async checkAuthStatus(user: User) {
    const token = this.getJwtToken({ id: user.id });
    return {
      ...user,
      token,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleError(e: any): never {
    if (e.code === '23505') {
      throw new BadRequestException(e.detail);
    }
    throw new InternalServerErrorException('Please Check Server Logs');
  }
}
