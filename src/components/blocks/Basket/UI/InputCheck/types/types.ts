import type { ChangeEventHandler } from 'react';

export interface InputCheckInterface {
    checked: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}