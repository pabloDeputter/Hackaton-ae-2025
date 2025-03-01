import MapView from "./MapView";
export declare class Simulator {
    currentPopulation: number;
    currentTime: number;
    mapView: MapView;
    lockedLocations: Array<string>;
    constructor(mapview: MapView);
    start(): void;
    nextStep(): void;
    updateInterface(): void;
}
