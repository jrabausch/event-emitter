import type { EmitterEvent, EventDispatcher, ListenerArray } from './types';

export class LoopEventDispatcher implements EventDispatcher {
  public dispatch<T extends EmitterEvent>(event: T, listeners: ListenerArray<T>): number {
    const length = listeners.length;
    let count = 0;
    for (let i = 0; i < length; i++) {
      const entry = listeners[i];
      if (!entry) {
        continue;
      }
      if (entry[1]) {
        listeners[i] = undefined;
      }
      entry[0](event);
      count++;
    }
    return count;
  };
}
