export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};

export type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventListener<T extends EmitterEvent> = (event: T) => void;
type ListenerArray<T extends EmitterEvent> = Array<[EventListener<T>, boolean] | undefined>;
type EmitterFunction<T extends EmitterEvent> = (event: T, listeners: ListenerArray<T>) => void;

class EventDispatcher {
  public readonly dispatch: EmitterFunction<EmitterEvent>;
  constructor(
    public readonly size: number,
  ) {
    let code = 'const len = listeners.length; let li;';
    for (let i = 0; i < size; i++) {
      code += `\nif(${i} >= len) return;`;
      code += `\nli = listeners[${i}];`;
      code += `\nif(li?.[1]) listeners[${i}] = undefined;`;
      code += `\nli?.[0](event);`;
    }
    // eslint-disable-next-line no-new-func
    this.dispatch = new Function('event', 'listeners', code) as EmitterFunction<EmitterEvent>;
  }
}

export class EventEmitter {
  protected readonly listenerMap: Map<EventType<EmitterEvent>, ListenerArray<never>> = new Map();
  protected eventDispatcher: EventDispatcher;
  constructor(dispatchSize: number = 10) {
    this.eventDispatcher = new EventDispatcher(dispatchSize);
  }

  public once<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this {
    return this.add(event, listener, true);
  }

  public on<T extends EmitterEvent>(event: EventType<T>, listener: EventListener<T>): this {
    return this.add(event, listener);
  }

  public off<T extends EmitterEvent>(event: EventType<T>, listener?: EventListener<T>): this {
    if (listener) {
      const listeners = this.listenerMap.get(event);
      if (listeners) {
        const filtered = listeners.filter(entry => entry && entry[0] !== listener);
        if (filtered.length > 0) {
          this.listenerMap.set(event, filtered);
        }
        else {
          this.listenerMap.delete(event);
        }
      }
    }
    else {
      this.listenerMap.delete(event);
    }
    return this;
  }

  public emit<T extends EmitterEvent>(event: T): this {
    const type = event.constructor as EventType<T>;
    const listeners = this.listenerMap.get(type) as ListenerArray<EmitterEvent> | undefined;
    if (listeners) {
      this.eventDispatcher.dispatch(event, listeners);
    }
    return this;
  }

  public listeners<T extends EmitterEvent>(event: EventType<T>): EventListener<T>[] {
    const listeners = this.listenerMap.get(event);
    if (listeners) {
      return listeners
        .filter((entry): entry is [EventListener<T>, boolean] => !!entry)
        .map(([li]) => li);
    }
    return [];
  }

  public events(): EventType<EmitterEvent>[] {
    return Array.from(this.listenerMap.keys());
  }

  public clear(): this {
    this.listenerMap.clear();
    return this;
  }

  protected add<T extends EmitterEvent>(
    event: EventType<T>,
    listener: EventListener<T>,
    once: boolean = false,
  ): this {
    const listeners = this.listenerMap.get(event);
    let count = 1;
    if (listeners) {
      const filtered = listeners.filter(entry => entry && entry[0] !== listener);
      this.listenerMap.set(event, [...filtered, [listener, once]]);
      count += filtered.length;
    }
    else {
      this.listenerMap.set(event, [[listener, once]]);
    }
    if (count > this.eventDispatcher.size) {
      this.eventDispatcher = new EventDispatcher(count);
    }
    return this;
  }
}
