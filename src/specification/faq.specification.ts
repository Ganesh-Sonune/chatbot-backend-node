import { ILike }from 'typeorm';

export class FaqSpecification {

static hasQuestion(question?:string,){
if(!question||question.trim()===''){return {};}
return {
question:ILike(`%${question}%`,),
};
}

static isActive(isActive?:boolean,){
if(isActive===undefined||isActive===null){return {};}
return {
status:isActive,
};
}

}