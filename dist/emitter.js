;
class EmitterCustomEvent extends Event {
    constructor(event) {
        super(event.constructor.name);
        this.event = event;
    }
}
export class EventEmitter {
    constructor() {
        this.eventTarget = new EventTarget();
        this.eventMap = new Map();
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
            if (false === callback(e.event)) {
                e.stopImmediatePropagation();
            }
        };
        let map = this.eventMap.get(event);
        if (map === undefined) {
            map = new WeakMap();
            this.eventMap.set(event, map);
        }
        map.set(callback, listener);
        this.eventTarget.addEventListener(event.name, listener);
        return this;
    }
    off(event, callback) {
        const map = this.eventMap.get(event);
        if (map !== undefined) {
            const listener = map.get(callback);
            if (listener !== undefined) {
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
}
