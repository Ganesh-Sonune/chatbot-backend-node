export abstract class AuthService {
  abstract login(username: string, password: string): Promise<any>;

}