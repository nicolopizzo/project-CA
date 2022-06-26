import { Request, Response, Router } from 'express';
import { authService } from '../services/auth.service';
import { LoginRequestDTO, SignupRequestDTO } from './dto/auth.dto';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const info: LoginRequestDTO = req.body;

  const { status, msg } = await authService.login(info);
  res.status(status).send({ msg });
});

router.put('/signup', async (req: Request, res: Response) => {
  const info: SignupRequestDTO = req.body;

  const { status, msg } = await authService.signup(info);
  res.status(status).send({ msg });
});

export { router as AuthRouter };
