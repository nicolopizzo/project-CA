import { AuthRequest } from '../controllers/dto/auth.dto';
import { User } from '../models/user.model';

const users: User[] = [
  {
    username: 'mariorossi',
    password: '1234',
  },
];

class AuthService {
  // private authRepository;

  async login(info: AuthRequest): Promise<boolean> {
    const username = info.user.username;
    const password = info.user.password;

    const user = users.find(
      (user) => (user.username === username, user.password === password)
    );
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}

export const authService = new AuthService();
