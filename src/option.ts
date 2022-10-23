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

class None implements Option<never> {
    isEmpty: boolean;
    constructor() {
        this.isEmpty = true;
    }
    unwrap(this: None): never { throw new Error(); }
    map<U>(this: None, f: (a: never) => U): Option<U> {
        return new None;
    }
    flatmap<U>(this: None, f: (a: never) => Option<U>): Option<U> {
        return new None;
    }
    contains(this: None, e: any): boolean {
        return false;
    }
    orelse<T>(this: None, that: T): T {
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

export function filterOption<T>(p: (v: T) => Boolean, v: T): Option<T> {
    return p(v) ? new Some(v) : new None;
}
