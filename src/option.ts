export interface Option<T> {
    readonly isEmpty: boolean;
    unwrap(this: Option<T>): T;
    map<U>(this: Option<T>, f: (a: T) => U): Option<U>;
    flatmap<U>(this: Option<T>, f: (a: T) => Option<U>): Option<U>;
    contains(this: Option<T>, e: T): boolean;
    orelse(this: Option<T>, that: T): T;
    or(this: Option<T>, that: Option<T>): Option<T>;
}

class Some<T> implements Option<T> {
    private value: T;
    readonly isEmpty: boolean;
    constructor(value: T) {
        this.value = value;
        this.isEmpty = false;
    }
    unwrap(this: Some<T>): T { return this.value; }
    map<U>(this: Some<T>, f: (a: T) => U): Some<U> {
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
    or(this: Some<T>, that: Option<T>): Some<T> {
        return this;
    }
}

class None implements Option<never> {
    readonly isEmpty: boolean;
    constructor() {
        this.isEmpty = true;
    }
    unwrap(this: None): never { throw new Error(); }
    map(this: None, f: (a: never) => any): None {
        return new None;
    }
    flatmap(this: None, f: (a: never) => Option<any>): None {
        return new None;
    }
    contains(this: None, e: any): boolean {
        return false;
    }
    orelse<T>(this: None, that: T): T {
        return that;
    }
    or<T>(this: None, that: Option<T>): Option<T> {
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

export function some<T>(u: T): Some<T> {
    return new Some(u);
}

export function none(): None {
    return new None;
}

export function filterOption<T>(p: (v: T) => Boolean): (v: T) => Option<T> {
    return v => p(v) ? new Some(v) : new None;
}
