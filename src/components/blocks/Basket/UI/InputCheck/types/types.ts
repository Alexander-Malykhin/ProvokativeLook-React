import type { ChangeEventHandler } from 'react';
export interface InputCheckInterface {
  checked: boolean;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
