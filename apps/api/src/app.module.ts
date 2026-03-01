import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BcryptPasswordHasher } from './auth/bcrypt-password-hasher';
import { TypeOrmUserRepository } from './database/repositories/typeorm-user.repository';
import { TypeOrmTeamRepository } from './database/repositories/typeorm-team.repository';
import { UserEntity } from './database/entities/user.entity';
import { TeamEntity } from './database/entities/team.entity';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'my_management_system',
      entities: [UserEntity, TeamEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserEntity, TeamEntity]),
    UsersModule,
    TeamsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'TeamRepository',
      useClass: TypeOrmTeamRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: ['UserRepository', 'TeamRepository', 'PasswordHasher'],
})
export class AppModule {}
