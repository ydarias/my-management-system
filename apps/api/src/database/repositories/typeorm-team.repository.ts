import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/models/team';
import { TeamEntity } from '../entities/team.entity';

export class TypeOrmTeamRepository implements TeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly repository: Repository<TeamEntity>,
  ) {}

  async save(team: Team): Promise<Team> {
    return this.repository.save(team);
  }

  async findByUserId(userId: number): Promise<Team[]> {
    return this.repository.find({ where: { owner: { id: userId } } });
  }

  async findById(id: number): Promise<Team | null> {
    return this.repository.findOne({ where: { id } });
  }
}
