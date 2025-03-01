import MapView from "./MapView";
import {GrowthStage, Plant} from "./interfaces";

export class Simulator {
  currentPopulation: number = 0;
  currentFood: number = 1000;
  currentTime: number = new Date().getTime();
  mapView: MapView;
  lockedLocations: Array<{ name: string; value: number }> = [
    { name: "Victory Mansions", value: 100 },
    { name: "Ministry of Truth", value: 200 },
    { name: "Ministry of Love", value: 400 },
    { name: "Ministry of Peace", value: 800 },
    { name: "Ministry of Plenty", value: 2000 },
    { name: "Chestnut Tree Café", value: 5000 },
    { name: "Golden Country", value: 10000 },
    { name: "Outer Party Sector", value: 30000 },
    { name: "Prole District", value: 100000 }
  ];

  constructor(mapview: MapView) {
    this.mapView = mapview;
  }

  lockTiles(){
    let tiles = this.mapView.getTileGrid();
    tiles.forEachQR((q, r, tile) => {
      if(this.lockedLocations.some(loc => loc.name === tile.location)){
        tile.locked = true;
        tile.fog = true;
      }
      else if(tile.location){
        tile.locked = false;
        tile.fog = false;
      }
    });
    this.mapView.updateTiles(tiles.toArray());

  }

  start() {
    this.lockTiles();

    const interval = setInterval(() => {
      this.nextStep();
    }, 1000);
  }

  nextStep() {
    this.currentTime += 24 * 60 * 60 * 1000;
    this.currentPopulation += 10;
    if(this.currentPopulation >= this.lockedLocations[0].value){
      this.lockedLocations.shift();
      this.lockTiles()
    }
    this.updateInterface();
    let tiles = this.mapView.getTileGrid();

    tiles.forEachQR((q, r, tile) => {
      if (tile.plant) {
        tile.plant = this.progressPlantGrowth(tile.plant);

        if (tile.plant.growthStage == GrowthStage.Harvestable) {
          console.log("Growth stage", tile.plant);
          this.currentFood += tile.plant.kcalPer100g * tile.plant.weightWhenFullGrown;
          tile.plant.growthStage = GrowthStage.Seed;
          tile.plant.daysSincePlanted = 0;
        }
      }
    });

    this.currentFood -= this.currentPopulation * 10;
    while (this.currentFood >= 100) {
      this.currentPopulation += 1;
      this.currentFood -= 100;
    }

    if (this.currentFood < 0) {
      this.currentPopulation -= 1;
    }
  }

  updateInterface() {
    document.getElementById("clock").innerHTML = new Date(
      this.currentTime
    ).toDateString();
  }

  progressPlantGrowth(plant: Plant): Plant {
    const { daysSincePlanted, timeToConsumable } = plant;

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
