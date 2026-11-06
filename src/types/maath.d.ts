declare module 'maath/random/dist/maath-random.esm' {
    export function inSphere(buffer: Float32Array, options?: { radius?: number;[key: string]: any }): Float32Array;
    export function inBox(buffer: Float32Array, options?: { sides?: number[];[key: string]: any }): Float32Array;
    // Add other functions as needed, or use a catch-all if uncertain about the full API
}
