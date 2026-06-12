export abstract class AdminService {

  abstract addAdmin(username: string, password: string): Promise<any>;

  abstract getAdmins(): Promise<any[]>;

  abstract toggleAdmin(id: number): Promise<any>;

  abstract resetPassword(id: number, password: string): Promise<any>;

  abstract getActivity(): Promise<any[]>;

  abstract updateAdmin(id: number, username: string): Promise<any>;

  abstract deleteAdmin(id: number): Promise<any>;
}