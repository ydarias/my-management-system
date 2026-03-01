import { Team } from '../models/team';

export interface TeamRepository {
  save(team: Team): Promise<Team>;
  findByUserId(userId: string): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
}
