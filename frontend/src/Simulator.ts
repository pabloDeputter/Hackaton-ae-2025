import MapView from "./MapView";
import {GrowthStage, Plant} from "./interfaces";

export class Simulator {
    currentPopulation: number = 0;
    currentFood: number = 1000;
    currentTime: number = new Date().getTime();
    mapView: MapView;
    lockedLocations: Array<string> = ["Victory Mansions", "Ministry of Truth",
        "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
        "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
        "Prole District"];

    constructor(mapview:MapView) {
        this.mapView = mapview;
    }


    start(){
        let tiles = this.mapView.getTileGrid();
        tiles.forEachQR((q,r, tile) => {
            console.log("tile",tile);
            if(this.lockedLocations.indexOf(tile.location) !== -1){
                tile.locked = true;
                tile.fog = true;
            }

        })

        this.mapView.updateTiles(tiles.toArray());

        const interval = setInterval(()=>{
            this.nextStep();
        }, 1000);
    }

    nextStep(){
        this.currentTime += 3600;
        this.currentPopulation = Math.random();
        this.updateInterface();
        let tiles = this.mapView.getTileGrid();

        tiles.forEachQR((q, r, tile) => {
            tile.plant = this.progressPlantGrowth(tile.plant);

            if (tile.plant.growthStage == GrowthStage.Harvestable) {
                this.currentFood += tile.plant.kcalPer100g * tile.plant.weightWhenFullGrown;
                tile.plant.growthStage = GrowthStage.Seed;
            }
        })

        this.currentFood -= this.currentPopulation * 10;
        while (this.currentFood >= 100) {
            this.currentPopulation += 1;
            this.currentFood -= 100;
        }

        if (this.currentFood < 0) {
            this.currentPopulation -= 1;
        }
    }

    updateInterface(){
        document.getElementById("clock").innerHTML = new Date(this.currentTime).toISOString()
    }


    progressPlantGrowth(plant: Plant): Plant {
        const {daysSincePlanted, timeToConsumable} = plant;

        // Determine the growth stage based on progression percentage
        const growthPercentage = (daysSincePlanted / timeToConsumable) * 100;

        let newGrowthStage: GrowthStage;

        if (growthPercentage < 20) {
            newGrowthStage = GrowthStage.Seed;
        } else if (growthPercentage < 40) {
            newGrowthStage = GrowthStage.Sprout;
        } else if (growthPercentage < 60) {
            newGrowthStage = GrowthStage.Young;
        } else if (growthPercentage < 80) {
            newGrowthStage = GrowthStage.Mature;
        } else if (growthPercentage < 100) {
            newGrowthStage = GrowthStage.Harvestable;
        } else {
            newGrowthStage = GrowthStage.Dead; // Plant dies after full maturity
        }

        return {
            ...plant,
            daysSincePlanted: plant.daysSincePlanted + 1, // Increment growth time
            growthStage: newGrowthStage, // Update growth stage
        };
    }
}