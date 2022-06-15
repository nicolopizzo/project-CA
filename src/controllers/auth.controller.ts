import { Request, Response, Router } from 'express';
import { authService } from '../services/auth.service';
import { LoginRequest, SignupRequest } from './dto/auth.dto';

const router = Router();

router.get('/login', async (req: Request, res: Response) => {
  const info: LoginRequest = req.body;

  const loginMsg = await authService.login(info);
  res.status(200).send(loginMsg);
});

router.get('/signup', async (req: Request, res: Response) => {
  const info: SignupRequest = req.body;

  const signupMsg = await authService.signup(info);
  res.status(200).send(signupMsg);
});

export { router as AuthRouter };
