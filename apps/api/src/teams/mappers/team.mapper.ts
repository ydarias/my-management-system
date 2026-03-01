import { CreateTeamRequest, TeamResponse } from '@repo/shared';
import { CreateTeamInput } from '../../domain/models/creational/create-team.input';
import { Team } from '../../domain/models/team';

export class TeamMapper {
  static toCreateTeamInput(userId: string, request: CreateTeamRequest): CreateTeamInput {
    return {
      userId,
      name: request.name,
      notes: request.notes,
    };
  }

  static toTeamResponse(team: Team): TeamResponse {
    return {
      id: team.id,
      ownerId: team.owner.id!,
      name: team.name,
      notes: team.notes,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
