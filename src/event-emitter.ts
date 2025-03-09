export type EmitterEvent = {
  [key: string]: any;
  [key: number]: any;
};

export type EventType<T extends EmitterEvent> = new (...args: any[]) => T;
export type EventListener<T extends EmitterEvent> = (event: T) => void;
type ListenerArray<T extends EmitterEvent> = Array<[EventListener<T>, boolean] | undefined>;

export class EventEmitter {
  protected readonly listenerMap: Map<EventType<EmitterEvent>, ListenerArray<never>> = new Map();

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
    const listeners = this.listenerMap.get(type) as ListenerArray<T> | undefined;
    if (listeners) {
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        const entry = listeners[i];
        if (!entry) {
          continue;
        }
        if (entry[1]) {
          listeners[i] = undefined;
        }
        entry[0](event);
      }
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
    if (listeners) {
      const filtered = listeners.filter(ev => ev && ev[0] !== listener);
      this.listenerMap.set(event, [...filtered, [listener, once]]);
    }
    else {
      this.listenerMap.set(event, [[listener, once]]);
    }
    return this;
  }
}
