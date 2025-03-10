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
    let code = "var len = arr.length, count = 0, li;";
    for (let i = 0; i < size; i++) {
      code += `
if(${i} === len) return count;`;
      code += `
if(li = arr[${i}]){ if(li[1]) arr[${i}] = undefined; li[0](ev); count++; }`;
    }
    code += `
if(${size} === len) return count;`;
    code += `
throw new RangeError('Dispatch function too small: ' + len + ' > ${size}');`;
    this.dispatch = new Function("ev", "arr", code);
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
        const filtered = this.filter(listeners, listener);
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
      return this.eventDispatcher.dispatch(event, listeners);
    }
    return 0;
  }
  listeners(event) {
    const listeners = this.listenerMap.get(event);
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
  events() {
    return Array.from(this.listenerMap.keys());
  }
  clear() {
    this.listenerMap.clear();
    return this;
  }
  add(event, listener, once = false) {
    const listeners = this.listenerMap.get(event);
    const entry = [listener, once];
    let count = 1;
    if (listeners) {
      const filtered = this.filter(listeners, listener);
      filtered.push(entry);
      this.listenerMap.set(event, filtered);
      count = filtered.length;
    } else {
      this.listenerMap.set(event, [entry]);
    }
    if (count > this.eventDispatcher.size) {
      this.eventDispatcher = new EventDispatcher(count + 10);
    }
    return this;
  }
  filter(arr, listener) {
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter
});
//# sourceMappingURL=event-emitter.js.map