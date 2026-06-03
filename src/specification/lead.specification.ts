import { ILike }from 'typeorm';

export class LeadSpecification {

static hasPhone(phone?:string,){
if(!phone||phone.trim()===''){return {};}
return {
phone:ILike(`%${phone}%`,),
};
}

static hasStatus(status?:string,){
if(!status||status.trim()===''){return {};}
return {
status:ILike(`%${status}%`,),
};
}

static hasRequestType(requestType?:string,){
if(!requestType||requestType.trim()===''){return {};}
return {
requestType:ILike(`%${requestType}%`,),
};
}

}