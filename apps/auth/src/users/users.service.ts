import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}

    public async create(createUserDto: CreateUserDto) {
        return this.usersRepository.create(createUserDto);
    }

}
