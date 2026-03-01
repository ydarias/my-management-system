import { Team } from './models/team';
import { TeamRepository } from './repositories/team.repository';
import { UserRepository } from './repositories/user.repository';
import { UserNotFoundError } from './errors/user-not-found.error';

export class GetUserTeamsUseCase {
  constructor(
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
  ) {}

  async execute(userId: number): Promise<Team[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return this.teamRepository.findByUserId(userId);
  }
}
