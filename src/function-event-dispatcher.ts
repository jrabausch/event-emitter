import type { EmitterEvent, EventDispatcher, ListenerArray } from './types';

export class FunctionEventDispatcher implements EventDispatcher {
  protected dispatchFunction: this['dispatch'];

  constructor(
    protected size: number = 10,
  ) {
    this.dispatchFunction = this.createFunction(size);
  }

  public dispatch<T extends EmitterEvent>(event: T, listeners: ListenerArray<T>): number {
    const length = listeners.length;
    if (length > this.size) {
      this.size = length + 10;
      this.dispatchFunction = this.createFunction(this.size);
    }
    return this.dispatchFunction(event, listeners);
  };

  protected createFunction(size: number): this['dispatch'] {
    let code = 'var len = arr.length, count = 0, li;';
    for (let i = 0; i < size; i++) {
      code += `\nif(${i} === len) return count;`;
      code += `\nif(li = arr[${i}]){ if(li.once) arr[${i}] = undefined; li.listener(ev); count++; }`;
    }
    code += `\nif(${size} === len) return count;`;
    code += `\nthrow new RangeError('Dispatch function too small: ' + len + ' > ${size}');`;
    // eslint-disable-next-line no-new-func
    return new Function('ev', 'arr', code) as this['dispatch'];
  }
}
