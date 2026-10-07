// Límite de intentos fallidos de login, en memoria (por instancia del servidor).
// Las funciones reciben `now` para poder probarlas sin esperar.

const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_KEYS = 10_000;
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;

// Marcas de tiempo de los fallos vigentes por clave. El orden de inserción del
// Map hace de orden de antigüedad: al registrar un fallo la clave se reinserta.
const failures = new Map<string, number[]>();

const live = (timestamps: number[], now: number): number[] =>
    timestamps.filter((t) => now - t < WINDOW_MS);

const pruneExpired = (now: number): void => {
    for (const [key, timestamps] of failures) {
        const kept = live(timestamps, now);
        if (kept.length === 0) failures.delete(key);
        else if (kept.length !== timestamps.length) failures.set(key, kept);
    }
};

// Segundos que faltan para poder reintentar; 0 si la clave no está bloqueada.
const retryAfterSeconds = (key: string, now: number = Date.now()): number => {
    const timestamps = failures.get(key);
    if (!timestamps) return 0;
    const kept = live(timestamps, now);
    if (kept.length === 0) {
        failures.delete(key);
        return 0;
    }
    if (kept.length < MAX_FAILURES) return 0;
    return Math.max(1, Math.ceil((kept[0] + WINDOW_MS - now) / 1000));
};

const isBlocked = (key: string, now: number = Date.now()): boolean => retryAfterSeconds(key, now) > 0;

const recordFailure = (key: string, now: number = Date.now()): void => {
    const kept = live(failures.get(key) ?? [], now);
    kept.push(now);
    failures.delete(key);
    failures.set(key, kept);
    while (failures.size > MAX_KEYS) {
        const oldest = failures.keys().next().value;
        if (oldest === undefined) break;
        failures.delete(oldest);
    }
};

const clearFailures = (key: string): void => {
    failures.delete(key);
};

const size = (): number => failures.size;

const reset = (): void => {
    failures.clear();
};

const pruneTimer = setInterval(() => pruneExpired(Date.now()), PRUNE_INTERVAL_MS);
pruneTimer.unref();

export {
    MAX_FAILURES,
    WINDOW_MS,
    MAX_KEYS,
    retryAfterSeconds,
    isBlocked,
    recordFailure,
    clearFailures,
    pruneExpired,
    size,
    reset,
};
