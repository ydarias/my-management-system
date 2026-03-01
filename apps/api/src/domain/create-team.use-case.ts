import { CreateTeamInput } from './models/creational/create-team.input';
import { Team } from './models/team';
import { TeamRepository } from './repositories/team.repository';
import { UserRepository } from './repositories/user.repository';
import { UserNotFoundError } from './errors/user-not-found.error';

export class CreateTeamUseCase {
  constructor(
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
  ) {}

  async execute(input: CreateTeamInput): Promise<Team> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const today = new Date();

    const team: Team = {
      owner: user,
      name: input.name,
      notes: input.notes,
      createdAt: today,
      updatedAt: today,
    };

    return this.teamRepository.save(team);
  }
}
