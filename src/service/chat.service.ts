import { ChatRequestModel }from '../model/chat-request.model';
import { ChatResponseModel }from '../model/chat-response.model';

export abstract class ChatService {

  abstract process( request: ChatRequestModel,): Promise<ChatResponseModel>;

}