import MapView from "./MapView";
import { Plant } from "./interfaces";
export declare class Simulator {
    currentPopulation: number;
    currentFood: number;
    currentTime: number;
    mapView: MapView;
    lockedLocations: Array<string>;
    constructor(mapview: MapView);
    start(): void;
    nextStep(): void;
    updateInterface(): void;
    progressPlantGrowth(plant: Plant): Plant;
}
