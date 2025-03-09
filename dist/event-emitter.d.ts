type EmitterEvent = {
    [key: string]: any;
    [key: number]: any;
};
type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
type EventListener<T extends EmitterEvent> = (event: T) => void;
type ListenerArray<T extends EmitterEvent> = Array<[EventListener<T>, boolean] | undefined>;
type EmitterFunction<T extends EmitterEvent> = (event: T, listeners: ListenerArray<T>) => void;
declare class EventDispatcher {
    readonly size: number;
    readonly dispatch: EmitterFunction<EmitterEvent>;
    constructor(size: number);
}
declare class EventEmitter {
    protected readonly listenerMap: Map<EventType<EmitterEvent>, ListenerArray<never>>;
    protected eventDispatcher: EventDispatcher;
    constructor(dispatchSize?: number);
    once<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this;
    on<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this;
    off<T extends EmitterEvent>(event: EventType<T>, listener?: EventListener<T>): this;
    emit<T extends EmitterEvent>(event: T): this;
    listeners<T extends EmitterEvent>(event: EventType<T>): EventListener<T>[];
    events(): EventType<EmitterEvent>[];
    clear(): this;
    protected add<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>, once?: boolean): this;
}

export { type EmitterEvent, EventEmitter, type EventListener, type EventType };
