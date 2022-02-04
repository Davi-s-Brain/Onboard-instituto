import * as jwt from 'jsonwebtoken';
import { CustomError } from '../error/error';

export interface DataAuthentication {
  id: number;
  rememberMe: boolean;
}

export class Authentication {
  public generate(input: DataAuthentication): string {
    const token = jwt.sign(input, process.env.JWT_KEY, {
      expiresIn: input.rememberMe
        ? process.env.ACCESS_TOKEN_EXPIRES_IN_REMEMBER_ME
        : process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    return token;
  }

  public tokenValidator(token: string) {
    if (!token) {
      throw new CustomError('Token not found', 400);
    }
    try {
      jwt.verify(token, process.env.JWT_KEY);
      return true;
    } catch {
      throw new CustomError('Invalid token', 400);
    }
  }
}
