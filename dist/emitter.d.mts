type EmitterEvent = {
    [key: string]: any;
    [key: number]: any;
};
type EventClass<T extends EmitterEvent> = new (...args: any[]) => T;
type EventCallback<T extends EmitterEvent> = (event: T) => false | void;
declare class EventEmitter {
    protected readonly eventTarget: EventTarget;
    protected readonly eventMap: Map<EventClass<EmitterEvent>, WeakMap<EventCallback<never>, EventListener>>;
    once<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this;
    on<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this;
    protected set<T extends EmitterEvent>(event: EventClass<T>, original: EventCallback<T>, callback: EventCallback<T>): this;
    off<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): boolean;
    emit<T extends EmitterEvent>(event: T): this;
}

export { type EmitterEvent, type EventCallback, type EventClass, EventEmitter };
