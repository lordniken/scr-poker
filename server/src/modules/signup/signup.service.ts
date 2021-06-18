import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/models';
import { UserEntity } from 'src/entities';
import { UserRegistrationDto } from 'src/dto';
import { isCorrectUsername } from 'src/utils/validations';
import { UserService } from '../user/user.service';

@Injectable()
export class SignupService {
  constructor(private readonly userService: UserService) {}

  async createUser(data: UserRegistrationDto): Promise<User | undefined> {
    const userExists = await this.userService.findUser({
      email: data.email,
    } as UserEntity);

    if (userExists) {
      throw new HttpException('USER_ALREADY_EXIST', HttpStatus.CONFLICT);
    }

    if (!isCorrectUsername(data.username)) {
      throw new HttpException('USERNAME_INCORRECT', HttpStatus.CONFLICT);
    }

    return await this.userService.createUser(data);
  }
}
