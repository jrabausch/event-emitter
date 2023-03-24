export interface EmitterEvent {
    [key: string]: any;
    [key: number]: any;
}
export type EventClass<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventCallback<T extends EmitterEvent> = (event: T) => false | void;
export declare class EventEmitter {
    protected eventTarget: EventTarget;
    protected eventMap: Map<EventClass<any>, WeakMap<EventCallback<any>, EventListener>>;
    once<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this;
    on<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this;
    off<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): boolean;
    emit<T extends EmitterEvent>(event: T): this;
}
