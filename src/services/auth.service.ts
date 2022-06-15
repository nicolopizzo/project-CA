import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../controllers/dto/auth.dto';
import { User } from '../models/user.model';

const users: User[] = [
  {
    username: 'mariorossi',
    password: '1234',
    pois: [
      {
        id: 'Osteria San P',
        position: {
          latitude: 45.4654,
          longitude: 9.1854,
        },
        type: 'restaurant',
        rank: 6.7,
      }
    ]
  }
];

class AuthService {
  // private authRepository;

  async login(info: LoginRequest): Promise<LoginResponse> {
    const username = info.username;
    const password = info.password;

    const userExists = users.find(
      (user) => (user.username === username && user.password === password)
    );

    let loginMsg = {} as LoginResponse;
    if (userExists){
      loginMsg.msg = "Logged in successfully";
    } else {
      loginMsg.msg = "Login failed";
    }
    return loginMsg;
  }

  async signup(info: SignupRequest): Promise<SignupResponse> {
    const username = info.username;
    const password = info.password;

    const usernameExists = users.find(
      (user) => (user.username === username)
    );

    let signupMsg = {} as LoginResponse;
    if (usernameExists){
      signupMsg.msg = "Signup failed - user already exists";
    } else {
      let user = {} as User;
      user.username = username;
      user.password = password;
      user.pois = [];
      users.push(user);
      signupMsg.msg = "Signup successful";
    }
    return signupMsg;
    
  }
}

export const authService = new AuthService();
