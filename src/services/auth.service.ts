import {
  LoginRequestDTO,
  LoginResponseDTO,
  SignupRequestDTO,
  SignupResponseDTO,
} from '../controllers/dto/auth.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { comparePasswords, hashPassword } from '../utils/password.utils';

class AuthService {
  async login(info: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { username, password } = info;

    const foundUser: User | null = await UserRepository.findOneBy({ username });

    if (foundUser === null) {
      return { msg: 'User not found', status: 404 };
    }

    const isRightPassword = await comparePasswords(
      password,
      foundUser.password
    );
    if (!isRightPassword) {
      return { msg: 'Password mismatch', status: 400 };
    }

    return { msg: 'Logged in successfully', status: 200 };
  }

  async signup(info: SignupRequestDTO): Promise<SignupResponseDTO> {
    const { username, password } = info;

    const foundUser = await UserRepository.findOneBy({ username });

    if (foundUser != undefined) {
      return { msg: 'User already signed up', status: 400 };
    }

    const hashedPassword = await hashPassword(password);

    const savedUser = await UserRepository.save({
      username,
      password: hashedPassword,
      pois: [],
    });
    return { msg: 'User saved successfully', status: 201 };
  }
}

export const authService = new AuthService();
