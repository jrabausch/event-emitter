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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  EventEmitter: () => EventEmitter,
  FunctionEventDispatcher: () => FunctionEventDispatcher,
  LoopEventDispatcher: () => LoopEventDispatcher
});
module.exports = __toCommonJS(index_exports);

// src/loop-event-dispatcher.ts
var LoopEventDispatcher = class {
  dispatch(event, listeners) {
    const length = listeners.length;
    let count = 0;
    for (let i = 0; i < length; i++) {
      const entry = listeners[i];
      if (!entry) {
        continue;
      }
      if (entry.once) {
        listeners[i] = void 0;
      }
      entry.listener(event);
      count++;
    }
    return count;
  }
};

// src/event-emitter.ts
var EventEmitter = class {
  constructor(dispatcher = new LoopEventDispatcher()) {
    this.dispatcher = dispatcher;
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
      return this.dispatcher.dispatch(event, listeners);
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
        entry && filtered.push(entry.listener);
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
    const entry = /* @__PURE__ */ Object.create({ listener, once });
    if (listeners) {
      const filtered = this.filter(listeners, listener);
      filtered.push(entry);
      this.listenerMap.set(event, filtered);
    } else {
      this.listenerMap.set(event, [entry]);
    }
    return this;
  }
  filter(arr, listener) {
    const filtered = [];
    const length = arr.length;
    for (let i = 0; i < length; i++) {
      const entry = arr[i];
      if (entry && entry.listener !== listener) {
        filtered.push(entry);
      }
    }
    return filtered;
  }
};

// src/function-event-dispatcher.ts
var FunctionEventDispatcher = class {
  constructor(size = 10) {
    this.size = size;
    this.dispatchFunction = this.createFunction(size);
  }
  dispatch(event, listeners) {
    const length = listeners.length;
    if (length > this.size) {
      this.size = length + 10;
      this.dispatchFunction = this.createFunction(this.size);
    }
    return this.dispatchFunction(event, listeners);
  }
  createFunction(size) {
    let code = "var len = arr.length, count = 0, li;";
    for (let i = 0; i < size; i++) {
      code += `
if(${i} === len) return count;`;
      code += `
if(li = arr[${i}]){ if(li.once) arr[${i}] = undefined; li.listener(ev); count++; }`;
    }
    code += `
if(${size} === len) return count;`;
    code += `
throw new RangeError('Dispatch function too small: ' + len + ' > ${size}');`;
    return new Function("ev", "arr", code);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventEmitter,
  FunctionEventDispatcher,
  LoopEventDispatcher
});
//# sourceMappingURL=index.js.map