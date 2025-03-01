import MapView from "./MapView";
import { Plant } from "./interfaces";
export declare class Simulator {
    currentPopulation: number;
    currentFood: number;
    currentTime: number;
    mapView: MapView;
    lockedLocations: Array<{
        name: string;
        value: number;
    }>;
    constructor(mapview: MapView);
    lockTiles(): void;
    start(): void;
    nextStep(): void;
    updateInterface(): void;
    progressPlantGrowth(plant: Plant): Plant;
}
