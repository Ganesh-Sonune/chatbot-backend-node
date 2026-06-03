// util/text-utils.util.ts

export class TextUtils {

static toLower(input:string,):string{
return input==null?'':input.toLowerCase();
}

static extractLastWord(message:string,):string{
if(!message||message===''){return '';}
const words=message.split(' ',);
return words[words.length-1];
}

}