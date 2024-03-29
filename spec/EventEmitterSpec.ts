import { EmitterEvent, EventCallback, EventEmitter } from '../src/emitter';

class TestEvent {
  public name: string = 'event';
  public payload: number = 1;
}

describe('EventEmitter', () => {

  let eventEmitter: EventEmitter;
  let emitterEvent: EmitterEvent;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    emitterEvent = new TestEvent();
  });

  it('should return self on emit', () => {

    const emitter = eventEmitter.emit(emitterEvent);
    expect(emitter).toBe(eventEmitter);
  });

  it('should emit an event', () => {

    let count = 0;

    eventEmitter.on(TestEvent, event => {
      expect(event).toBeInstanceOf(TestEvent);
      expect(event.name).toBe('event');
      expect(event.payload).toBe(1);
      count++;
    });

    eventEmitter.emit(emitterEvent);
    expect(count).toBe(1);
  });

  it('should listen many times', () => {

    let count = 0;
    eventEmitter.on(TestEvent, event => { count++ });

    const rand = (Math.random() * 10 + 2) | 0;

    Array(rand).fill(1).forEach(() => {
      eventEmitter.emit(emitterEvent);
    });

    expect(count).toBe(rand);
  });

  it('should listen once', () => {

    let count = 0;

    eventEmitter.once(TestEvent, event => { count++ });

    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);

    expect(count).toBe(1);
  });

  it('should remove a listener', () => {

    let count = 0;
    const listener: EventCallback<TestEvent> = (event) => { count++ };

    eventEmitter.on(TestEvent, listener);

    eventEmitter.emit(emitterEvent);

    expect(count).toBe(1);

    eventEmitter.emit(emitterEvent);

    expect(count).toBe(2);

    eventEmitter.off(TestEvent, listener);

    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);

    expect(count).toBe(2);
  });

  it('should stop callback execution', () => {

    let count = 0;
    let count2 = 0;

    eventEmitter.on(TestEvent, event => {
      count++;
      if (count > 1) {
        return false;
      }
    });

    eventEmitter.on(TestEvent, event => {
      count2++;
    });

    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);

    expect(count).toBe(3);
    expect(count2).toBe(1);
  });
});
