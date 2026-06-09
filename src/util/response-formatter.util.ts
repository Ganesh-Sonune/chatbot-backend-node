export class ResponseFormatter {

static shortReply(text:string,):string{

if(!text||text.trim()===''){return '';}

return text
.trim()
.replace(/(\r?\n){3,}/g,'\n\n',);
}

}