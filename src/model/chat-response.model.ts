export class ChatResponseModel {

  message!: string;
  options!: string[];

  isCourseCard?: boolean;
  courses?: any[];
  type?: string;

  constructor(
    message: string,
    options: string[],
    isCourseCard?: boolean,
    courses?: any[],
    type?: string
  ) {
    this.message = message;
    this.options = options;
    this.isCourseCard = isCourseCard ?? false;
    this.courses = courses ?? [];
    this.type = type ?? 'TEXT';
  }

  static simple(message: string): ChatResponseModel {
    return new ChatResponseModel(message, []);
  }

  static withOptions(message: string, options: string[]): ChatResponseModel {
    return new ChatResponseModel(message, options);
  }

  static withCourses(message: string, courses: any[]): ChatResponseModel {
    return new ChatResponseModel(
      message,
      [],
      true,
      courses,
      'COURSES'
    );
  }
}