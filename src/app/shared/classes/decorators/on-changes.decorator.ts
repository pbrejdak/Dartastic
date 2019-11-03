export function OnChanges<T = any>(
  callback: (value: T, change: SimpleChange<T>) => void
) {
  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();
  return (target, key) => {
    Object.defineProperty(target, key, {
      set: function(value) {
        if (this[cachedValueKey] === value) {
          return;
        }

        if (this[cachedValueKey] === undefined) {
          this[isFirstChangeKey] = true;
        } else {
          this[isFirstChangeKey] = false;
        }

        const simpleChange = {
          firstChange: this[isFirstChangeKey],
          previousValue: this[isFirstChangeKey],
          currentValue: value,
          isFirstChange: () => this[isFirstChangeKey]
        };

        this[cachedValueKey] = value;
        callback.call(this, value, simpleChange);
      },
      get: function() {
        return this[cachedValueKey];
      }
    });
  };
}

export interface SimpleChange<T> {
  firstChange: T;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => T;
}
