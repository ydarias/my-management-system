import { Router, Request, Response } from 'express';
import { CreateUserUseCase } from '@repo/use-cases';
import { ApiResponse } from '@repo/shared';
import { InMemoryUserRepository } from '../repositories/user.repository';

const router = Router();
const userRepository = new InMemoryUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email and name are required',
      };
      return res.status(400).json(response);
    }

    const user = await createUserUseCase.execute({ email, name });

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      message: 'User created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(400).json(response);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userRepository.findAll();

    const response: ApiResponse<typeof users> = {
      success: true,
      data: users,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findById(req.params.id);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
});

export default router;
