import MapView from "./MapView";
import { Plant, Weather, TileData } from "./interfaces";
export declare class Simulator {
    currentPopulation: number;
    activeTile: TileData;
    currentFood: number;
    currentProtein: number;
    currentCalories: number;
    currentTime: number;
    birthRate: number;
    deathRate: number;
    foodPerPersonPerDay: number;
    starvationThreshold: number;
    starvationDeathRate: number;
    isPaused: boolean;
    simulationSpeed: number;
    private intervalId;
    mapView: MapView;
    lockedLocations: Array<{
        name: string;
        value: number;
    }>;
    weather_data: Array<any>;
    constructor();
    setMapVieuw(mapview: MapView): void;
    lockTiles(): void;
    start(): void;
    private startInterval;
    setupControls(): void;
    togglePause(): void;
    updatePauseButtonText(): void;
    increaseSpeed(): void;
    decreaseSpeed(): void;
    nextStep(): void;
    updateInterface(): void;
    progressPlantGrowth(plant: Plant): Plant;
    getWeather(timestamp: number, location: string): Weather | null;
    setActiveCell(tile: TileData): void;
}
