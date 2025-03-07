// src/emitter.ts
var EmitterCustomEvent = class extends Event {
  constructor(event) {
    super(event.constructor.name);
    this.event = event;
  }
};
var EventEmitter = class {
  constructor() {
    this.eventTarget = new EventTarget();
    this.eventMap = /* @__PURE__ */ new Map();
  }
  once(event, callback) {
    const wrapper = (e) => {
      this.off(event, wrapper);
      return callback(e);
    };
    return this.on(event, wrapper);
  }
  on(event, callback) {
    const listener = (e) => {
      if (callback(e.event) === false) {
        e.stopImmediatePropagation();
      }
    };
    let map = this.eventMap.get(event);
    if (map === void 0) {
      map = /* @__PURE__ */ new WeakMap();
      this.eventMap.set(event, map);
    }
    map.set(callback, listener);
    this.eventTarget.addEventListener(event.name, listener);
    return this;
  }
  off(event, callback) {
    const map = this.eventMap.get(event);
    if (map !== void 0) {
      const listener = map.get(callback);
      if (listener !== void 0) {
        this.eventTarget.removeEventListener(event.name, listener);
        return map.delete(callback);
      }
    }
    return false;
  }
  emit(event) {
    const customEvent = new EmitterCustomEvent(event);
    this.eventTarget.dispatchEvent(customEvent);
    return this;
  }
};
export {
  EventEmitter
};
//# sourceMappingURL=emitter.mjs.map