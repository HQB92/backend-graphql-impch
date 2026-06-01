// Devuelve rango [inicio, finExclusivo) para un mes/año dado.
// Usar en WHERE date >= inicio AND date < fin (sargable, usa índice).
export const monthRange = (mes?: number, anio?: number): { start: string; end: string } | null => {
    const m = Number(mes);
    const y = Number(anio);
    if (!Number.isInteger(m) || !Number.isInteger(y) || m < 1 || m > 12 || y < 1900) {
        return null;
    }
    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const nextMonth = m === 12 ? 1 : m + 1;
    const nextYear = m === 12 ? y + 1 : y;
    const end = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
    return { start, end };
};
