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
      this.off(event, callback);
      return callback(e);
    };
    return this.set(event, callback, wrapper);
  }
  on(event, callback) {
    return this.set(event, callback, callback);
  }
  set(event, original, callback) {
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
    map.set(original, listener);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter
});
//# sourceMappingURL=emitter.js.map