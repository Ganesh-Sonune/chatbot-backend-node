// repository/impl/user.repository.impl.ts

import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { Repository }from 'typeorm';
import { UserRepository }from '../user.repository';
import { User }from '../../entity/user.entity';

@Injectable()
export class UserRepositoryImpl extends UserRepository {

constructor(
@InjectRepository(User)
private readonly repo:Repository<User>,
){super();}

async save(user:User,):Promise<User>{
return await this.repo.save(user,);
}

async findById(id:number,):Promise<User|null>{
return await this.repo.findOne({
where:{
id,
},
});
}

async findByUsername(username:string,):Promise<User|null>{
return await this.repo.findOne({
where:{
username,
},
});
}

}