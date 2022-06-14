import { User } from '../../models/user.model';

export class AuthRequest {
  user: User;
}

export class AuthResponse {
  signed: boolean[];
}
