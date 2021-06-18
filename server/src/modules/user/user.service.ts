import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities';
import { User } from 'src/models';
import { UserRegistrationDto } from 'src/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findUser(data: UserEntity): Promise<User | undefined> {
    return await this.usersRepository.findOne(data);
  }

  async createUser(data: UserRegistrationDto): Promise<User | undefined> {
    const user = await this.usersRepository.create(data);

    return await this.usersRepository.save(user);
  }
}
