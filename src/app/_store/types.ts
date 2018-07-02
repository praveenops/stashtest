import { DATA_STATE } from './data-states';

export interface TypeAny {
  state: DATA_STATE;
  data: any;
  error?: any;
}

export interface TypeObject<T> extends TypeAny {
  data: T & object;
}

export interface TypeArray<T> extends TypeAny {
  data: T[];
}

export interface TypeString extends TypeAny {
  data: string;
}

export interface TypeNumber extends TypeAny {
  data: number;
}

export interface TypeBoolean extends TypeAny {
  data: boolean;
}
