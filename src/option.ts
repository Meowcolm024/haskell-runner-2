export interface Option<T> {
    isEmpty: boolean;
    unwrap(this: Option<T>): T;
    map<U>(this: Option<T>, f: (a: T) => U): Option<U>;
    flatmap<U>(this: Option<T>, f: (a: T) => Option<U>): Option<U>;
    contains(this: Option<T>, e: T): boolean;
    orelse(this: Option<T>, that: T): T;
}

class Some<T> implements Option<T> {
    private value: T;
    isEmpty: boolean;
    constructor(value: T) {
        this.value = value;
        this.isEmpty = false;
    }
    unwrap(this: Some<T>): T { return this.value; }
    map<U>(this: Some<T>, f: (a: T) => U): Option<U> {
        return new Some(f(this.value));
    }
    flatmap<U>(this: Some<T>, f: (a: T) => Option<U>): Option<U> {
        return f(this.value);
    }
    contains(this: Some<T>, e: T): boolean {
        return this.value === e;
    }
    orelse(this: Some<T>, that: T): T {
        return this.value;
    }
}

class None implements Option<any> {
    isEmpty: boolean;
    constructor() {
        this.isEmpty = true;
    }
    unwrap<T>(this: None): T { throw new Error(); }
    map<U>(this: Option<any>, f: (a: any) => U): Option<U> {
        return new None;
    }
    flatmap<U>(this: Option<any>, f: (a: any) => Option<U>): Option<U> {
        return new None;
    }
    contains(this: None, e: any): boolean {
        return false;
    }
    orelse<T>(this: Some<T>, that: T): T {
        return that;
    }
}

export function option<T>(u: T | undefined): Option<T> {
    if (u === undefined) {
        return new None;
    } else {
        return new Some(u);
    }
}

export function some<T>(u: T): Option<T> {
    return new Some(u);
}

export function none<T>(): Option<T> {
    return new None;
}