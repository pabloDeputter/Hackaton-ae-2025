import { Texture } from "three";
import { QR } from "./interfaces";
export declare function loadTexture(url: string, onProgress?: (percent: number, totalBytes: number, loadedBytes: number) => void): Promise<Texture>;
export declare function loadFile(path: string): Promise<string>;
export declare function loadJSON<T>(path: string): Promise<T>;
export declare function qrRange(qrRadius: number): QR[];
export declare function forEachRange(min: number, max: number, f: (n: number) => void): number[];
export declare function shuffle<T>(a: T[]): T[];
export declare function range(minOrMax: number, max?: number): number[];
export declare function flatMap<T, R>(items: T[], map: (item: T, index?: number) => R[]): R[];
export declare function sum(numbers: number[]): number;
export declare function qrEquals(a: QR, b: QR): boolean;
export declare function minBy<T>(items: T[], by: (item: T) => number): T | null;
export declare function isInteger(value: number): boolean;
export declare function flatten<T>(items: T[][]): T[];
export declare function loadWeatherJSON(): Promise<any>;
/**
 * Convert hex color string to an RGB object.
 */
export declare function hexToRGB(hex: string): {
    r: number;
    g: number;
    b: number;
};
