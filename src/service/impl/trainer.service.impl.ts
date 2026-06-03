import { Injectable }from '@nestjs/common';
import { Trainer }from '../../entity/trainer.entity';
import { DuplicateResourceException }from '../../exception/duplicate-resource.exception';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { TrainerRepository }from '../../repository/trainer.repository';
import { TrainerService }from '../trainer.service';
import { TrainerSpecification }from '../../specification/trainer.specification';

@Injectable()
export class TrainerServiceImpl implements TrainerService {

constructor(private readonly repo:TrainerRepository,) {}

async create(trainer:Trainer,):Promise<Trainer> {
if(trainer.email){
const existingTrainer=await this.repo.findByEmail(trainer.email,);
if(existingTrainer){throw new DuplicateResourceException('Trainer already exists with this email',);}
}
const exists=await this.repo.existsByNameAndCourseName(trainer.name,trainer.courseName,);
if(exists){throw new DuplicateResourceException('Trainer already assigned to this course',);}
return await this.repo.save(trainer,);
}

async getById(id:number,):Promise<Trainer> {
const trainer=await this.repo.findById(id,);
if(!trainer){throw new ResourceNotFoundException(`Trainer not found: ${id}`,);}
return trainer;
}

async getAll():Promise<Trainer[]> {
return await this.repo.findByStatusTrue();
}

async update(id:number,trainer:Trainer,):Promise<Trainer> {
const existing=await this.getById(id,);
existing.name=trainer.name;
existing.email=trainer.email;
existing.phone=trainer.phone;
existing.experience=trainer.experience;
existing.specialization=trainer.specialization;
existing.courseName=trainer.courseName;
return await this.repo.save(existing,);
}

async delete(id:number,):Promise<void> {
const existing=await this.getById(id,);
await this.repo.delete(existing,);
}

async search(name:string,email:string,specialization:string,minExp:number,page:number,size:number,):Promise<Trainer[]> {
const nameFilter=TrainerSpecification.hasName(name,);
const emailFilter=TrainerSpecification.hasEmail(email,);
const specializationFilter=TrainerSpecification.hasSpecialization(specialization,);
const minExpFilter=TrainerSpecification.hasMinExperience(minExp,);
return await this.repo.search(nameFilter,emailFilter,specializationFilter,minExpFilter,page,size,);
}

async updateStatus(id:number,status:boolean,):Promise<void> {
const existing=await this.getById(id,);
existing.status=status;
await this.repo.save(existing,);
}

}