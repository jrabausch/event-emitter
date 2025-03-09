import type { EmitterEvent } from '../src/event-emitter';
import { EventEmitter } from '../src/event-emitter';

class TestEvent {
  public readonly name: string = 'event';
  public readonly payload: number = 1;
}

class ExtendedEvent extends TestEvent {
  public readonly type: string = 'extended';
}

describe('eventEmitter', () => {
  let eventEmitter: EventEmitter;
  let emitterEvent: EmitterEvent;
  let extendedEvent: ExtendedEvent;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    emitterEvent = new TestEvent();
    extendedEvent = new ExtendedEvent();
  });

  it('should return self on emit', () => {
    const emitter = eventEmitter.emit(emitterEvent);
    expect(emitter).toBe(eventEmitter);
  });

  it('should emit an event', () => {
    let count = 0;

    eventEmitter.on(TestEvent, (event) => {
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
    eventEmitter.on(TestEvent, () => {
      count++;
    });

    const rand = (Math.random() * 10 + 2) | 0;

    Array.from({ length: rand }).fill(1).forEach(() => {
      eventEmitter.emit(emitterEvent);
    });

    expect(count).toBe(rand);
  });

  it('should listen once', () => {
    let count = 0;

    eventEmitter.once(TestEvent, () => {
      count++;
    });

    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);
    eventEmitter.emit(emitterEvent);

    expect(count).toBe(1);
  });

  it('should remove a listener', () => {
    let count = 0;
    const listener = () => {
      count++;
    };

    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    expect(eventEmitter.events().length).toBe(0);

    eventEmitter.once(TestEvent, listener);
    expect(eventEmitter.listeners(TestEvent).length).toBe(1);
    expect(eventEmitter.events()).toEqual([TestEvent]);

    eventEmitter.off(TestEvent, listener);
    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    expect(eventEmitter.events().length).toBe(0);

    eventEmitter.emit(emitterEvent);
    expect(count).toBe(0);
  });

  it('should remove once listener', () => {
    let count = 0;
    const listener = () => {
      count++;
    };

    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    expect(eventEmitter.events().length).toBe(0);

    eventEmitter.once(TestEvent, listener);
    expect(eventEmitter.listeners(TestEvent).length).toBe(1);
    expect(eventEmitter.events()).toEqual([TestEvent]);

    eventEmitter.off(TestEvent, listener);
    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    expect(eventEmitter.events().length).toBe(0);

    eventEmitter.emit(emitterEvent);
    expect(count).toBe(0);
  });

  it('should remove all event listeners', () => {
    const listener1 = () => { };
    const listener2 = () => { };

    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    eventEmitter.on(TestEvent, listener1).on(TestEvent, listener2);
    expect(eventEmitter.listeners(TestEvent).length).toBe(2);

    eventEmitter.off(TestEvent);
    expect(eventEmitter.listeners(TestEvent).length).toBe(0);
    expect(eventEmitter.events()).toEqual([]);
  });

  it('should work with inherited instances', () => {
    let count = 0;
    eventEmitter.on(ExtendedEvent, (ev) => {
      expect(ev.type).toBe('extended');
      count++;
    });
    eventEmitter.emit(extendedEvent);
    expect(count).toBe(1);
  });

  it('should return all listeners', () => {
    const listener1 = () => { };
    const listener2 = () => { };

    expect(eventEmitter.listeners(TestEvent)).toEqual([]);
    expect(eventEmitter.listeners(ExtendedEvent)).toEqual([]);

    eventEmitter
      .on(TestEvent, listener1)
      .on(TestEvent, listener2);
    eventEmitter.on(ExtendedEvent, listener2);

    const lis1 = eventEmitter.listeners(TestEvent);
    expect(lis1.length).toBe(2);
    expect(lis1).toEqual([listener1, listener2]);
    const lis2 = eventEmitter.listeners(ExtendedEvent);
    expect(lis2.length).toBe(1);
    expect(lis2).toEqual([listener2]);
  });

  it('should return events', () => {
    const listener = () => { };

    expect(eventEmitter.events()).toEqual([]);

    eventEmitter.on(ExtendedEvent, listener);
    eventEmitter.on(TestEvent, listener);

    const events = eventEmitter.events();
    expect(events).toEqual([ExtendedEvent, TestEvent]);
  });

  it('should clear itself', () => {
    const listener = () => { };

    expect(eventEmitter.events().length).toBe(0);

    eventEmitter.on(ExtendedEvent, listener);
    eventEmitter.on(TestEvent, listener);

    expect(eventEmitter.events().length).toBe(2);

    eventEmitter.clear();
    expect(eventEmitter.events().length).toBe(0);
  });
});
