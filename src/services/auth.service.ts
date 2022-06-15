import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../controllers/dto/auth.dto';
import { User } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';

class AuthService {
  async login(info: LoginRequest): Promise<LoginResponse> {
    const username = info.username;
    const password = info.password;

    const userExists = await userRepository.findByUsernameAndPassword(
      username,
      password
    );

    let loginMsg = {} as LoginResponse;
    if (userExists === undefined) {
      loginMsg.msg = 'Login failed';
    } else {
      loginMsg.msg = 'Logged in successfully';
    }
    return loginMsg;
  }

  async signup(info: SignupRequest): Promise<SignupResponse> {
    const username = info.username;
    const password = info.password;

    const userExists = await userRepository.findByUsername(username);

    let signupMsg = {} as LoginResponse;
    if (userExists === undefined) {
      let user = {} as User;
      user.username = username;
      user.password = password;
      user.pois = [];
      await userRepository.save(user);
      signupMsg.msg = 'Signup successful';
    } else {
      signupMsg.msg = 'Signup failed - user already exists';
    }
    return signupMsg;
  }
}

export const authService = new AuthService();
