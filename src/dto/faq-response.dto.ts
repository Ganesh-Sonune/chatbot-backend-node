export class FaqResponseDto {

  id: number;

  question: string;

  answer: string;

  status: boolean;

  constructor(
    id: number,
    question: string,
    answer: string,
    status: boolean,
  ) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.status = status;
  }
}