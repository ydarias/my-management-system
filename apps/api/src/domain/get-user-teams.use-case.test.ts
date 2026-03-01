import { mock, mockReset } from 'jest-mock-extended';
import { GetUserTeamsUseCase } from './get-user-teams.use-case';
import { UserRepository } from './repositories/user.repository';
import { TeamRepository } from './repositories/team.repository';
import { User } from './models/user';
import { Team } from './models/team';
import { UserNotFoundError } from './errors/user-not-found.error';

describe('GetUserTeamsUseCase', () => {
  const userRepository = mock<UserRepository>();
  const teamRepository = mock<TeamRepository>();
  const useCase = new GetUserTeamsUseCase(userRepository, teamRepository);

  beforeEach(() => {
    mockReset(userRepository);
    mockReset(teamRepository);
  });

  it('should return teams for an existing user', async () => {
    const userId = 1;

    const user: User = {
      id: userId,
      email: 'owner@example.com',
      name: 'Owner',
      password: 'hashed',
      createdAt: new Date(),
    };

    const teams: Team[] = [
      {
        id: 1,
        owner: user,
        name: 'Engineering',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        owner: user,
        name: 'Design',
        notes: 'UI/UX team',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    userRepository.findById.calledWith(userId).mockResolvedValue(user);
    teamRepository.findByUserId.calledWith(userId).mockResolvedValue(teams);

    const result = await useCase.execute(userId);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Engineering');
    expect(result[1].name).toBe('Design');
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const userId = 99;

    userRepository.findById.calledWith(userId).mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(UserNotFoundError);
  });

  it('should return empty array when user has no teams', async () => {
    const userId = 1;

    const user: User = {
      id: userId,
      email: 'owner@example.com',
      name: 'Owner',
      password: 'hashed',
      createdAt: new Date(),
    };

    userRepository.findById.calledWith(userId).mockResolvedValue(user);
    teamRepository.findByUserId.calledWith(userId).mockResolvedValue([]);

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
  });
});
