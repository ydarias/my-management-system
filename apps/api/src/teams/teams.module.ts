import { Module } from '@nestjs/common';
import { CreateTeamUseCase } from '../domain/create-team.use-case';
import { GetUserTeamsUseCase } from '../domain/get-user-teams.use-case';
import { UserRepository } from '../domain/repositories/user.repository';
import { TeamRepository } from '../domain/repositories/team.repository';
import { TeamsController } from './teams.controller';

@Module({
  controllers: [TeamsController],
  providers: [
    {
      provide: CreateTeamUseCase,
      useFactory: (userRepository: UserRepository, teamRepository: TeamRepository) =>
        new CreateTeamUseCase(userRepository, teamRepository),
      inject: ['UserRepository', 'TeamRepository'],
    },
    {
      provide: GetUserTeamsUseCase,
      useFactory: (userRepository: UserRepository, teamRepository: TeamRepository) =>
        new GetUserTeamsUseCase(userRepository, teamRepository),
      inject: ['UserRepository', 'TeamRepository'],
    },
  ],
})
export class TeamsModule {}
