import type {
  EmitterEvent,
  EventDispatcher,
  EventListener,
  EventType,
  ListenerArray,
  ListenerConfig,
} from './types';
import { LoopEventDispatcher } from './loop-event-dispatcher';
import { SeekMap } from './seek-map';

export class EventEmitter {
  protected readonly listenerMap: SeekMap<EventType<EmitterEvent>, ListenerArray<never>> = new SeekMap();

  constructor(
    protected readonly dispatcher: EventDispatcher = new LoopEventDispatcher(),
  ) { }

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
    const listeners = this.listenerMap.get(type) as ListenerArray<T> | undefined;
    if (listeners) {
      return this.dispatcher.dispatch(event, listeners);
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
    const entry: ListenerConfig<T> = [listener, once];
    if (listeners) {
      const filtered = this.filter(listeners, listener);
      filtered.push(entry);
      this.listenerMap.set(event, filtered);
    }
    else {
      this.listenerMap.set(event, [entry]);
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
