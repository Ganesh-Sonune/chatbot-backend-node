import {Body,Controller,Inject, Post,} from '@nestjs/common';
import { ChatRequestModel }from '../model/chat-request.model';
import { ChatResponseModel }from '../model/chat-response.model';
import { ChatService }from '../service/chat.service';

@Controller('api/chat')
export class ChatController {

  constructor( @Inject(ChatService)private readonly service:ChatService,) {}

  @Post()
  async chat(@Body()request: ChatRequestModel,): Promise<ChatResponseModel> {
    return await this.service.process(   request,);
  }


}