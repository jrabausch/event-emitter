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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter
});
//# sourceMappingURL=event-emitter.js.map