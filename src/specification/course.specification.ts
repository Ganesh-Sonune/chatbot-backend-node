import { ILike }from 'typeorm';

export class CourseSpecification {

static hasName(name?:string,){
if(!name||name.trim()===''){return {};}
return {
name:ILike(`%${name}%`,),
};
}

static hasMode(mode?:string,){
if(!mode||mode.trim()===''){return {};}
return {
mode:ILike(`%${mode}%`,),
};
}

static isActive(isActive?:boolean,){
if(isActive===undefined||isActive===null){return {};}
return {
status:isActive,
};
}

}