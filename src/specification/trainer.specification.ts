import { ILike,MoreThanOrEqual }from 'typeorm';

export class TrainerSpecification {

static hasName(name?:string,){
if(!name||name.trim()===''){return {};}
return {
name:ILike(`%${name}%`,),
};
}

static hasEmail(email?:string,){
if(!email||email.trim()===''){return {};}
return {
email:ILike(`%${email}%`,),
};
}

static hasSpecialization(specialization?:string,){
if(!specialization||specialization.trim()===''){return {};}
return {
specialization:ILike(`%${specialization}%`,),
};
}

static hasMinExperience(minExp?:number,){
if(minExp===undefined||minExp===null||minExp<=0){return {};}
return {
experience:MoreThanOrEqual(minExp,),
};
}

}