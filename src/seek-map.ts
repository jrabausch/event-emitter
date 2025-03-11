export class SeekMap<K, V> {
  protected readonly keyArray: K[] = [];
  protected readonly valueStore: Record<number, V> = {};

  constructor() { }

  get size() {
    return this.keyArray.length;
  }

  public clear(): void {
    this.keyArray.length = 0;
    const values = this.valueStore;
    for (const key in values) {
      delete values[key];
    }
  }

  public keys(): K[] {
    return [...this.keyArray];
  }

  public set(key: K, value: V): this {
    const keys = this.keyArray;
    const values = this.valueStore;
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      if (keys[i] === key) {
        values[i] = value;
        return this;
      }
    }
    const index = keys.push(key) - 1;
    values[index] = value;
    return this;
  }

  public get(key: K): V | undefined {
    const keys = this.keyArray;
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      if (keys[i] === key) {
        return this.valueStore[i];
      }
    }
    return undefined;
  }

  public has(key: K): boolean {
    const keys = this.keyArray;
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      if (keys[i] === key) {
        return true;
      }
    }
    return false;
  }

  public delete(key: K): boolean {
    const keys = this.keyArray;
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      if (keys[i] !== key) {
        continue;
      }
      delete this.valueStore[i];
      if (i === 0) {
        keys.shift();
      }
      else if (i === length - 1) {
        keys.length = i;
      }
      else {
        keys.splice(i, 1);
      }
      return true;
    }
    return false;
  }
}
