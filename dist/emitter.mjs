// src/emitter.ts
var EventEmitter = class {
  constructor() {
    this.eventMap = /* @__PURE__ */ new WeakMap();
  }
  once(event, callback) {
    return this.set(event, callback, true);
  }
  on(event, callback) {
    return this.set(event, callback);
  }
  off(event, callback) {
    const events = this.eventMap.get(event);
    if (events) {
      const filtered = events.filter((ev) => ev && ev[0] !== callback);
      if (filtered.length > 0) {
        this.eventMap.set(event, filtered);
      } else {
        this.eventMap.delete(event);
      }
    }
    return this;
  }
  emit(event) {
    const klass = event.constructor;
    const events = this.eventMap.get(klass);
    if (events) {
      const length = events.length;
      for (let i = 0; i < length; i++) {
        const entry = events[i];
        if (!entry) {
          continue;
        }
        if (entry[1]) {
          events[i] = void 0;
        }
        if (entry[0](event) === false) {
          break;
        }
      }
    }
    return this;
  }
  set(event, callback, once = false) {
    const events = this.eventMap.get(event);
    if (events) {
      const filtered = events.filter((ev) => ev && ev[0] !== callback);
      this.eventMap.set(event, [...filtered, [callback, once]]);
    } else {
      this.eventMap.set(event, [[callback, once]]);
    }
    return this;
  }
};
export {
  EventEmitter
};
//# sourceMappingURL=emitter.mjs.map