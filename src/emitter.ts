export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};

export type EventClass<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventCallback<T extends EmitterEvent> = (event: T) => false | void;

class EmitterCustomEvent extends Event {
  event: EmitterEvent;
  constructor(event: EmitterEvent) {
    super(event.constructor.name);
    this.event = event;
  }
}

export class EventEmitter {
  protected readonly eventTarget: EventTarget = new EventTarget();
  protected readonly eventMap: Map<EventClass<EmitterEvent>, WeakMap<EventCallback<never>, EventListener>> = new Map();

  once<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this {
    const wrapper = (e: T) => {
      this.off(event, callback);
      return callback(e);
    };
    return this.set(event, callback, wrapper);
  }

  on<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this {
    return this.set(event, callback, callback);
  }

  protected set<T extends EmitterEvent>(event: EventClass<T>, original: EventCallback<T>, callback: EventCallback<T>): this {
    const listener = (e: Event) => {
      if (callback((e as EmitterCustomEvent).event as T) === false) {
        e.stopImmediatePropagation();
      }
    };

    let map = this.eventMap.get(event);

    if (map === undefined) {
      map = new WeakMap();
      this.eventMap.set(event, map);
    }

    map.set(original, listener);

    this.eventTarget.addEventListener(event.name, listener);

    return this;
  }

  off<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): boolean {
    const map = this.eventMap.get(event);

    if (map !== undefined) {
      const listener = map.get(callback);

      if (listener !== undefined) {
        this.eventTarget.removeEventListener(event.name, listener);
        return map.delete(callback);
      }
    }

    return false;
  }

  emit<T extends EmitterEvent>(event: T): this {
    const customEvent = new EmitterCustomEvent(event);
    this.eventTarget.dispatchEvent(customEvent);

    return this;
  }
}
