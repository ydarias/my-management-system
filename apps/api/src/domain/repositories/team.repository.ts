import { Team } from '../models/team';

export interface TeamRepository {
  save(team: Team): Promise<Team>;
  findByUserId(userId: number): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
}
