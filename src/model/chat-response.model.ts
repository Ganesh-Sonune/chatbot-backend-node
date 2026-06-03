export class ChatResponseModel {

  message!: string;

  options!: string[];

  constructor(
    message: string,
    options: string[],
  ) {
    this.message = message;
    this.options = options;
  }

  static withOptions(
    message: string,
    options: string[],
  ): ChatResponseModel {

    return new ChatResponseModel(
      message,
      options,
    );
  }

  static simple(
    message: string,
  ): ChatResponseModel {

    return new ChatResponseModel(
      message,
      [],
    );
  }

  static of(
    message: string,
  ): ChatResponseModel {

    return new ChatResponseModel(
      message,
      [],
    );
  }
}