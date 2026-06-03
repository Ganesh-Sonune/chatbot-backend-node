export enum Operator {

  LESS_THAN = 'LESS_THAN',

  GREATER_THAN = 'GREATER_THAN',

  EQUALS = 'EQUALS',

  NONE = 'NONE',
}

export class DurationFilterModel {

  operator!: Operator;

  weeks!: number;

  constructor(
    operator: Operator,
    weeks: number,
  ) {
    this.operator = operator;
    this.weeks = weeks;
  }
}