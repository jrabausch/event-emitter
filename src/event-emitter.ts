export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};

export type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventListener<T extends EmitterEvent> = (event: T) => void;
type ListenerArray<T extends EmitterEvent> = Array<[EventListener<T>, boolean] | undefined>;
type EmitterFunction<T extends EmitterEvent> = (event: T, listeners: ListenerArray<T>) => number;

class EventDispatcher {
  public readonly dispatch: EmitterFunction<EmitterEvent>;
  constructor(
    public readonly size: number,
  ) {
    let code = 'var len = arr.length, count = 0, li;';
    for (let i = 0; i < size; i++) {
      code += `\nif(${i} === len) return count;`;
      code += `\nif(li = arr[${i}]){ if(li[1]) arr[${i}] = undefined; li[0](ev); count++; }`;
    }
    code += `\nif(${size} === len) return count;`;
    code += `\nthrow new RangeError('Dispatch function too small: ' + len + ' > ${size}');`;
    // eslint-disable-next-line no-new-func
    this.dispatch = new Function('ev', 'arr', code) as EmitterFunction<EmitterEvent>;
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
        const filtered = this.filter(listeners, listener);
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

  public emit<T extends EmitterEvent>(event: T): number {
    const type = event.constructor as EventType<T>;
    const listeners = this.listenerMap.get(type) as ListenerArray<EmitterEvent> | undefined;
    if (listeners) {
      return this.eventDispatcher.dispatch(event, listeners);
    }
    return 0;
  }

  public listeners<T extends EmitterEvent>(event: EventType<T>): EventListener<T>[] {
    const listeners = this.listenerMap.get(event) as ListenerArray<T> | undefined;
    const filtered = [];
    if (listeners) {
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        const entry = listeners[i];
        entry && filtered.push(entry[0]);
      }
    }
    return filtered;
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
    const entry: [EventListener<T>, boolean] = [listener, once];
    let count = 1;
    if (listeners) {
      const filtered = this.filter(listeners, listener);
      filtered.push(entry);
      this.listenerMap.set(event, filtered);
      count = filtered.length;
    }
    else {
      this.listenerMap.set(event, [entry]);
    }
    if (count > this.eventDispatcher.size) {
      // dynamically increase dispatch size
      this.eventDispatcher = new EventDispatcher(count + 10);
    }
    return this;
  }

  protected filter<T extends EmitterEvent>(
    arr: ListenerArray<T>,
    listener: EventListener<T>,
  ): ListenerArray<T> {
    const filtered = [];
    const length = arr.length;
    for (let i = 0; i < length; i++) {
      const entry = arr[i];
      if (entry && entry[0] !== listener) {
        filtered.push(entry);
      }
    }
    return filtered;
  }
}
