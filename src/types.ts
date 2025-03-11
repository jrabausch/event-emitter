export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};
export type ListenerConfig<T extends EmitterEvent> = {
  listener: EventListener<T>;
  once: boolean;
};
export type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventListener<T extends EmitterEvent> = (event: T) => void;
export type ListenerArray<T extends EmitterEvent> = Array<ListenerConfig<T> | undefined>;
export type EventDispatcher = {
  dispatch: <T extends EmitterEvent>(event: T, listeners: ListenerArray<T>) => number;
};
