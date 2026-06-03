export class DuplicateResourceException extends Error {

  constructor(message: string) {

    super(message);

    this.name =
      'DuplicateResourceException';
  }
}