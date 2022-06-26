export class LoginRequestDTO {
  username: string;
  password: string;
}

export class LoginResponseDTO {
  msg: string;
  status: number;
}

export class SignupRequestDTO {
  username: string;
  password: string;
}

export class SignupResponseDTO {
  msg: string;
  status: number;
}
