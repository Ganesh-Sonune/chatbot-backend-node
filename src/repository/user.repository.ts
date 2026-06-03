import { User }from '../entity/user.entity';

export abstract class UserRepository {

  abstract save(user: User,): Promise<User>;

  abstract findById(id: number,): Promise<User | null>;

  abstract findByUsername(username: string,): Promise<User | null>;

}