// src/event-emitter.ts
var EventDispatcher = class {
  constructor(size) {
    this.size = size;
    let code = "const len = listeners.length; let li;";
    for (let i = 0; i < size; i++) {
      code += `
if(${i} >= len) return;`;
      code += `
li = listeners[${i}];`;
      code += `
if(li?.[1]) listeners[${i}] = undefined;`;
      code += `
li?.[0](event);`;
    }
    this.dispatch = new Function("event", "listeners", code);
  }
};
var EventEmitter = class {
  constructor(dispatchSize = 10) {
    this.listenerMap = /* @__PURE__ */ new Map();
    this.eventDispatcher = new EventDispatcher(dispatchSize);
  }
  once(event, listener) {
    return this.add(event, listener, true);
  }
  on(event, listener) {
    return this.add(event, listener);
  }
  off(event, listener) {
    if (listener) {
      const listeners = this.listenerMap.get(event);
      if (listeners) {
        const filtered = listeners.filter((entry) => entry && entry[0] !== listener);
        if (filtered.length > 0) {
          this.listenerMap.set(event, filtered);
        } else {
          this.listenerMap.delete(event);
        }
      }
    } else {
      this.listenerMap.delete(event);
    }
    return this;
  }
  emit(event) {
    const type = event.constructor;
    const listeners = this.listenerMap.get(type);
    if (listeners) {
      this.eventDispatcher.dispatch(event, listeners);
    }
    return this;
  }
  listeners(event) {
    const listeners = this.listenerMap.get(event);
    if (listeners) {
      return listeners.filter((entry) => !!entry).map(([li]) => li);
    }
    return [];
  }
  events() {
    return Array.from(this.listenerMap.keys());
  }
  clear() {
    this.listenerMap.clear();
    return this;
  }
  add(event, listener, once = false) {
    const listeners = this.listenerMap.get(event);
    let count = 1;
    if (listeners) {
      const filtered = listeners.filter((entry) => entry && entry[0] !== listener);
      this.listenerMap.set(event, [...filtered, [listener, once]]);
      count += filtered.length;
    } else {
      this.listenerMap.set(event, [[listener, once]]);
    }
    if (count > this.eventDispatcher.size) {
      this.eventDispatcher = new EventDispatcher(count);
    }
    return this;
  }
};
export {
  EventEmitter
};
//# sourceMappingURL=event-emitter.mjs.map