import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/models/user';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
