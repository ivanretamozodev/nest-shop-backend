import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      return user;
    } catch (e) {
      this.handleError(e);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true },
      });

      if (!user) throw new UnauthorizedException('Credentials not valid');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials not valid');

      return user;
    } catch (e) {
      this.handleError(e);
    }
  }

  private handleError(e: any): never {
    if (e.code === '23505') {
      throw new BadRequestException(e.detail);
    }
    throw new InternalServerErrorException('Please Check Server Logs');
  }
}
