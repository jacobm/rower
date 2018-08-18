export interface Success<T> {
    item: T;
}
export class Ok<T> implements Success<T> {
    item: T;
    constructor(value: T) {
        this.item = value;
    }
}
export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
    return true;
}
export interface Failure<Err> {
    error: Err;
}
export class Fail<T> implements Failure<T> {
    error: T;
    constructor(value: T) {
        this.error = value;
    }
}

export type Result<T, E> = Success<T> | Failure<E>;
