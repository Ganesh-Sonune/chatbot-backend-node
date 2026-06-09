import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { ILike,Repository }from 'typeorm';
import { TrainerRepository }from '../trainer.repository';
import { Trainer }from '../../entity/trainer.entity';

@Injectable()
export class TrainerRepositoryImpl extends TrainerRepository {

constructor(
@InjectRepository(Trainer)
private readonly repo:Repository<Trainer>,
){super();}

async save(trainer:Trainer,):Promise<Trainer>{
return await this.repo.save(trainer,);
}

async delete(trainer:Trainer,):Promise<void>{
await this.repo.remove(trainer,);
}

async findById(id:number,):Promise<Trainer|null>{
return await this.repo.findOne({where:{id,},});
}

async findAll():Promise<Trainer[]>{
return await this.repo.find();
}

async findByEmail(email:string,):Promise<Trainer|null>{
return await this.repo.findOne({
where:{
email,
},
});
}

async findByStatusTrue():Promise<Trainer[]>{
return await this.repo.find({
where:{
status:true,
},
});
}

async existsByNameAndCourseName(name:string,courseName:string,):Promise<boolean>{
const count=await this.repo.count({
where:{
name,
courseName,
},
});
return count>0;
}

async findByNameContainingIgnoreCase(name:string,):Promise<Trainer[]>{
return await this.repo.find({
where:{
name:ILike(`%${name}%`,),
},
});
}

async findByNameContainingIgnoreCaseAndStatusTrue(name:string,):Promise<Trainer[]>{
return await this.repo.find({
where:{
name:ILike(`%${name}%`,),
status:true,
},
});
}

async findBySpecializationContainingIgnoreCaseAndStatusTrue(specialization:string,):Promise<Trainer[]>{
return await this.repo.find({
where:{
specialization:ILike(`%${specialization}%`,),
status:true,
},
});
}

async searchBySpecialization(specialization:string,):Promise<Trainer[]>{
return await this.repo.find({
where:{
specialization:ILike(`%${specialization}%`,),
status:true,
},
});
}

async findAllExperiences():Promise<number[]>{
const result=await this.repo.find({
select:{
experience:true,
},
where:{
status:true,
},
});
return result.map(trainer=>trainer.experience,);
}

async search(nameFilter:any,emailFilter:any,specializationFilter:any,minExpFilter:any,page:number,size:number,):Promise<Trainer[]>{
return await this.repo.find({
where:{
...nameFilter,
...emailFilter,
...specializationFilter,
...minExpFilter,
},
skip:page*size,
take:size,
});
}

}