import bcrypt from 'bcrypt';

const salt = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, salt);
}

async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export { hashPassword, comparePasswords };
