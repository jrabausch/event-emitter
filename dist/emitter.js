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

// src/emitter.ts
var emitter_exports = {};
__export(emitter_exports, {
  EventEmitter: () => EventEmitter
});
module.exports = __toCommonJS(emitter_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter
});
//# sourceMappingURL=emitter.js.map