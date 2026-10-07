// Interpreta TRUST_PROXY: vacío = no confiar en ningún proxy (comportamiento
// por defecto); entero >= 0 = cantidad de proxies; otro texto (loopback, una
// lista de IP o CIDR) se entrega tal cual a Express.
export const parseTrustProxy = (value: string | undefined): number | string | undefined => {
    const text = value?.trim();
    if (!text) return undefined;
    if (/^\d+$/.test(text)) return Number(text);
    // Parece numérico pero no es un entero >= 0 (-1, 1.5, 1e3): se ignora.
    if (Number.isFinite(Number(text))) return undefined;
    return text;
};
