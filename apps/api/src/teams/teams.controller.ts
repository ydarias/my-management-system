import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTeamUseCase } from '../domain/create-team.use-case';
import { GetUserTeamsUseCase } from '../domain/get-user-teams.use-case';
import { CreateTeamRequest, TeamResponse } from '@repo/shared';
import { TeamMapper } from './mappers/team.mapper';

@Controller('users/:userId/teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(
    @Inject(CreateTeamUseCase)
    private readonly createTeamUseCase: CreateTeamUseCase,
    @Inject(GetUserTeamsUseCase)
    private readonly getUserTeamsUseCase: GetUserTeamsUseCase,
  ) {}

  @Post()
  async createTeam(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() request: CreateTeamRequest,
  ): Promise<TeamResponse> {
    const team = await this.createTeamUseCase.execute(TeamMapper.toCreateTeamInput(userId, request));
    return TeamMapper.toTeamResponse(team);
  }

  @Get()
  async getUserTeams(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<TeamResponse[]> {
    const teams = await this.getUserTeamsUseCase.execute(userId);
    return teams.map(TeamMapper.toTeamResponse);
  }
}
