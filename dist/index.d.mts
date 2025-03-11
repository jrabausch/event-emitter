type EmitterEvent = {
    [key: string]: any;
    [key: number]: any;
};
type ListenerConfig<T extends EmitterEvent> = {
    0: EventListener<T>;
    1: boolean;
};
type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
type EventListener<T extends EmitterEvent> = (event: T) => void;
type ListenerArray<T extends EmitterEvent> = Array<ListenerConfig<T> | undefined>;
type EventDispatcher = {
    dispatch: <T extends EmitterEvent>(event: T, listeners: ListenerArray<T>) => number;
};

declare class SeekMap<K, V> {
    protected readonly keyArray: K[];
    protected readonly valueStore: Record<number, V>;
    constructor();
    get size(): number;
    clear(): void;
    keys(): K[];
    set(key: K, value: V): this;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
}

declare class EventEmitter {
    protected readonly dispatcher: EventDispatcher;
    protected readonly listenerMap: SeekMap<EventType<EmitterEvent>, ListenerArray<never>>;
    constructor(dispatcher?: EventDispatcher);
    once<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this;
    on<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this;
    off<T extends EmitterEvent>(event: EventType<T>, listener?: EventListener<T>): this;
    emit<T extends EmitterEvent>(event: T): number;
    listeners<T extends EmitterEvent>(event: EventType<T>): EventListener<T>[];
    events(): EventType<EmitterEvent>[];
    clear(): this;
    protected add<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>, once?: boolean): this;
    protected filter<T extends EmitterEvent>(arr: ListenerArray<T>, listener: EventListener<T>): ListenerArray<T>;
}

declare class FunctionEventDispatcher implements EventDispatcher {
    protected size: number;
    protected dispatchFunction: this['dispatch'];
    constructor(size?: number);
    dispatch<T extends EmitterEvent>(event: T, listeners: ListenerArray<T>): number;
    protected createFunction(size: number): this['dispatch'];
}

declare class LoopEventDispatcher implements EventDispatcher {
    dispatch<T extends EmitterEvent>(event: T, listeners: ListenerArray<T>): number;
}

export { type EmitterEvent, type EventDispatcher, EventEmitter, type EventListener, type EventType, FunctionEventDispatcher, type ListenerArray, type ListenerConfig, LoopEventDispatcher };
