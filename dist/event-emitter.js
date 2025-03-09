"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/event-emitter.ts
var event_emitter_exports = {};
__export(event_emitter_exports, {
  EventEmitter: () => EventEmitter
});
module.exports = __toCommonJS(event_emitter_exports);
var EventEmitter = class {
  constructor() {
    this.listenerMap = /* @__PURE__ */ new Map();
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
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        const entry = listeners[i];
        if (!entry) {
          continue;
        }
        if (entry[1]) {
          listeners[i] = void 0;
        }
        entry[0](event);
      }
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
    if (listeners) {
      const filtered = listeners.filter((ev) => ev && ev[0] !== listener);
      this.listenerMap.set(event, [...filtered, [listener, once]]);
    } else {
      this.listenerMap.set(event, [[listener, once]]);
    }
    return this;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter
});
//# sourceMappingURL=event-emitter.js.map