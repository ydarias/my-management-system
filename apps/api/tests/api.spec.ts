import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InMemoryUserRepository } from '../src/domain/repositories/in-memory/in-memory-user.repository';
import { AuthModule } from '../src/auth/auth.module';
import { BcryptPasswordHasher } from '../src/auth/bcrypt-password-hasher';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { UsersModule } from '../src/users/users.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');

describe('API Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
      providers: [
        { provide: 'UserRepository', useClass: InMemoryUserRepository },
        { provide: 'PasswordHasher', useClass: BcryptPasswordHasher },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          error: 'UserAlreadyExistsError',
        }),
      );
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
