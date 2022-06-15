import { Request, Response, Router } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from './dto/auth.dto';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const info: AuthRequest = req.body;

  // console.log(req.body);
  const isSigned = await authService.login(info);
  res.status(200).send(isSigned);
});

export { router as AuthRouter };
