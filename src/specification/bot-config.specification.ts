import { ILike }from 'typeorm';

export class BotConfigSpecification {

static hasKey(key?:string,){
if(!key||key.trim()===''){return {};}
return {
configKey:ILike(`%${key}%`,),
};
}

static hasValue(value?:string,){
if(!value||value.trim()===''){return {};}
return {
configValue:ILike(`%${value}%`,),
};
}

}