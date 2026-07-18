import {
  getBuiltInDuckIntroDefaults,
  readDuckIntroDefaults,
  writeDuckIntroDefaults,
  type DuckIntroDefaults,
} from '@/src/components/ui/duckIntro/duckIntroSettings';

let snapshot = getBuiltInDuckIntroDefaults();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getDuckIntroDefaultsSnapshot(): DuckIntroDefaults {
  return snapshot;
}

export function subscribeDuckIntroDefaults(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

/** Read localStorage into the store (call once on client mount). */
export function hydrateDuckIntroDefaultsFromStorage(): void {
  snapshot = readDuckIntroDefaults();
  emit();
}

export function persistDuckIntroDefaults(defaults: DuckIntroDefaults): void {
  writeDuckIntroDefaults(defaults);
  snapshot = { ...defaults };
  emit();
}
