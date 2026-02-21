import { Global, Module, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthModule } from '../src/auth/auth.module';
import { BcryptPasswordHasher } from '../src/auth/bcrypt-password-hasher';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { UserEntity } from '../src/database/entities/user.entity';
import { TypeOrmUserRepository } from '../src/database/repositories/typeorm-user.repository';
import { UsersModule } from '../src/users/users.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');

jest.setTimeout(60_000);

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    TypeOrmUserRepository,
    { provide: 'UserRepository', useClass: TypeOrmUserRepository },
    { provide: 'PasswordHasher', useClass: BcryptPasswordHasher },
  ],
  exports: ['UserRepository', 'PasswordHasher'],
})
class TestGlobalModule {}

describe('API Integration', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17-alpine').start();

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getMappedPort(5432),
          username: container.getUsername(),
          password: container.getPassword(),
          database: container.getDatabase(),
          entities: [UserEntity],
          synchronize: true,
        }),
        TestGlobalModule,
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'john@example.com', name: 'John Doe', password: 'secret123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: 'john@example.com',
          name: 'John Doe',
        }),
      );
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 409 when user already exists', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'duplicate@example.com', name: 'First', password: 'secret123' });

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'duplicate@example.com', name: 'Second', password: 'secret456' });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'login@example.com', name: 'Login User', password: 'mypassword' });
    });

    it('should return access_token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'mypassword' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });
  });
});
