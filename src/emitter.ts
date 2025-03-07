export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};

export type EventClass<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventCallback<T extends EmitterEvent> = (event: T) => false | void;
type CallbackArray<T extends EmitterEvent> = Array<[EventCallback<T>, boolean] | undefined>;

export class EventEmitter {
  protected readonly eventMap: WeakMap<EventClass<EmitterEvent>, CallbackArray<never>> = new WeakMap();

  once<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this {
    return this.set(event, callback, true);
  }

  on<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this {
    return this.set(event, callback);
  }

  off<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>): this {
    const events = this.eventMap.get(event);
    if (events) {
      const filtered = events.filter(ev => ev && ev[0] !== callback);
      if (filtered.length > 0) {
        this.eventMap.set(event, filtered);
      }
      else {
        this.eventMap.delete(event);
      }
    }
    return this;
  }

  emit<T extends EmitterEvent>(event: T): this {
    const klass = event.constructor as EventClass<T>;
    const events = this.eventMap.get(klass);
    if (events) {
      const length = events.length;
      for (let i = 0; i < length; i++) {
        const entry = events[i];
        if (!entry) {
          continue;
        }
        if (entry[1]) {
          events[i] = undefined;
        }
        if (entry[0](event as never) === false) {
          break;
        }
      }
    }
    return this;
  }

  protected set<T extends EmitterEvent>(event: EventClass<T>, callback: EventCallback<T>, once: boolean = false): this {
    const events = this.eventMap.get(event);
    if (events) {
      const filtered = events.filter(ev => ev && ev[0] !== callback);
      this.eventMap.set(event, [...filtered, [callback, once]]);
    }
    else {
      this.eventMap.set(event, [[callback, once]]);
    }
    return this;
  }
}
