export declare class Simulator {
    currentPopulation: number;
    currentTime: number;
    lockedLocations: string[];
    start(): void;
    nextStep(): void;
    updateInterface(): void;
}
