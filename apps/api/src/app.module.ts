import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BcryptPasswordHasher } from './auth/bcrypt-password-hasher';
import { TypeOrmUserRepository } from './users/typeorm-user.repository';
import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'my_management_system',
      entities: [UserEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: ['UserRepository', 'PasswordHasher'],
})
export class AppModule {}
