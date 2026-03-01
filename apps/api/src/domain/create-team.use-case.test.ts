import { mock, mockReset } from 'jest-mock-extended';
import { CreateTeamUseCase } from './create-team.use-case';
import { UserRepository } from './repositories/user.repository';
import { TeamRepository } from './repositories/team.repository';
import { CreateTeamInput } from './models/creational/create-team.input';
import { User } from './models/user';
import { Team } from './models/team';
import { UserNotFoundError } from './errors/user-not-found.error';

describe('CreateTeamUseCase', () => {
  const userRepository = mock<UserRepository>();
  const teamRepository = mock<TeamRepository>();
  const useCase = new CreateTeamUseCase(userRepository, teamRepository);

  beforeEach(() => {
    mockReset(userRepository);
    mockReset(teamRepository);
  });

  it('should create a team successfully', async () => {
    const input: CreateTeamInput = {
      userId: 1,
      name: 'Engineering',
      notes: 'Main engineering team',
    };

    const user: User = {
      id: 1,
      email: 'owner@example.com',
      name: 'Owner',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedTeam: Team = {
      id: 1,
      owner: user,
      name: input.name,
      notes: input.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.findById.calledWith(input.userId).mockResolvedValue(user);
    teamRepository.save.mockResolvedValue(savedTeam);

    const result = await useCase.execute(input);

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      owner: {
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }
    });
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const input: CreateTeamInput = {
      userId: 99,
      name: 'Ghost Team',
    };

    userRepository.findById.calledWith(input.userId).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(UserNotFoundError);
  });
});
