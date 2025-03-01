import MapView from "./MapView";
import { GrowthStage, Plant , Weather} from "./interfaces";
import {loadWeatherJSON} from "./util"

export class Simulator {
  currentPopulation: number = 10;
  currentFood: number = 1000;
  currentProtein: number = 0;
  currentCalories: number = 0;
  currentTime: number = 1672524000 * 1000;

  // Add demographic variables
  birthRate: number = 0.01; // 1% chance of new birth per step
  deathRate: number = 0.005; // 0.5% natural death rate per step
  foodPerPersonPerDay: number = 8; // Base food requirement
  starvationThreshold: number = 0.7; // Below 70% of required food causes starvation
  starvationDeathRate: number = 0.05; // 5% death rate during starvation

  // New properties for simulation control
  isPaused: boolean = false;
  simulationSpeed: number = 1; // Default speed multiplier
  private intervalId: NodeJS.Timeout | null = null;
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
    { name: "Prole District", value: 100000 },
  ];
  weather_data: Array<any>;

  constructor(mapview: MapView) {
    this.mapView = mapview;
    loadWeatherJSON().then(data => {
      this.weather_data = data
    });
  }

  lockTiles() {
    let tiles = this.mapView.getTileGrid();
    tiles.forEachQR((q, r, tile) => {
      if (this.lockedLocations.some((loc) => loc.name === tile.location)) {
        tile.locked = true;
        tile.fog = true;
      } else if (tile.location) {
        tile.locked = false;
        tile.fog = false;
      }
    });
    this.mapView.updateTiles(tiles.toArray());
  }

  start() {

    this.lockTiles();
    this.setupControls();
    this.startInterval();
  }

  private startInterval() {
    // Clear existing interval if any
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Calculate interval based on speed (smaller interval = faster simulation)
    const intervalTime = Math.floor(1500 / this.simulationSpeed);

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.nextStep();
      }
    }, intervalTime);
  }

  setupControls() {
    // Set up pause button
    const pauseButton = document.getElementById("pauseButton");
    if (pauseButton) {
      pauseButton.addEventListener("click", () => {
        this.togglePause();
        this.updatePauseButtonText();
      });
    }

    // Set up slow button
    const slowButton = document.getElementById("slowButton");
    if (slowButton) {
      slowButton.addEventListener("click", () => {
        this.decreaseSpeed();
      });
    }

    // Set up fast button
    const fastButton = document.getElementById("fastButton");
    if (fastButton) {
      fastButton.addEventListener("click", () => {
        this.increaseSpeed();
      });
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    console.log(`Simulation ${this.isPaused ? "paused" : "resumed"}`);
  }

  updatePauseButtonText() {
    const pauseButton = document.getElementById("pauseButton");
    if (pauseButton) {
      pauseButton.innerHTML = this.isPaused
        ? `        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="h-4 w-4">
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>
        Play`
        : `        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          class="h-4 w-4"
        >
          <path
            d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"
          />
        </svg>
        Pause`;
    }
  }

  increaseSpeed() {
    // Maximum speed is 5x
    this.simulationSpeed = Math.min(5, this.simulationSpeed + 0.5);
    console.log(`Simulation speed: ${this.simulationSpeed}x`);
    this.startInterval(); // Restart with new speed
  }

  decreaseSpeed() {
    // Minimum speed is 0.5x
    this.simulationSpeed = Math.max(0.5, this.simulationSpeed - 0.5);
    console.log(`Simulation speed: ${this.simulationSpeed}x`);
    this.startInterval(); // Restart with new speed
  }

  nextStep() {
    this.currentTime += 24 * 60 * 60 * 1000; // Add one day

    // Unlock new locations if population threshold is reached
    if (this.lockedLocations.length > 0 &&
        this.currentPopulation >= this.lockedLocations[0].value) {
      this.lockedLocations.shift();
      this.lockTiles();
    }

    // Process plant growth and harvests
    let tiles = this.mapView.getTileGrid();
    let newCalories = 0;
    let newProtein = 0;

    tiles.forEachQR((q, r, tile) => {
      if (tile.plant) {
        tile.plant = this.progressPlantGrowth(tile.plant);

        // Harvest plants when ready
        if (tile.plant.growthStage >= GrowthStage.Harvestable) {
          // Calculate nutritional yield from harvest
          newCalories += tile.plant.kcalPer100g * tile.plant.weightWhenFullGrown;
          newProtein += tile.plant.proteinsPer100g * tile.plant.weightWhenFullGrown;

          // Reset plant to seed stage
          tile.plant.growthStage = GrowthStage.Seed;
          tile.plant.daysSincePlanted = 0;
        }
      }
    });

    // Add harvested nutrients to stockpile
    this.currentCalories += newCalories;
    this.currentProtein += newProtein;

    // Calculate food consumption based on population
    const foodRequired = this.currentPopulation * this.foodPerPersonPerDay;

    // Update food supply (calories + protein converted to energy)
    this.currentFood = this.currentCalories + (this.currentProtein * 4);

    // Consume food
    const foodAvailableRatio = Math.min(1, this.currentFood / foodRequired);
    this.currentFood -= foodRequired * foodAvailableRatio;

    // Population dynamics
    let newBirths = 0;
    let naturalDeaths = 0;
    let starvationDeaths = 0;

    // Calculate births and deaths
    if (foodAvailableRatio >= this.starvationThreshold) {
      // Normal conditions - births and natural deaths
      newBirths = Math.floor(this.currentPopulation * this.birthRate * (foodAvailableRatio > 0.9 ? 1.2 : 1));
      naturalDeaths = Math.floor(this.currentPopulation * this.deathRate);
    } else {
      // Starvation conditions - reduced births, increased deaths
      newBirths = Math.floor(this.currentPopulation * this.birthRate * 0.5);
      naturalDeaths = Math.floor(this.currentPopulation * this.deathRate);
      starvationDeaths = Math.floor(this.currentPopulation * this.starvationDeathRate *
                         (1 - foodAvailableRatio / this.starvationThreshold));
    }

    // Update population
    this.currentPopulation += newBirths - naturalDeaths - starvationDeaths;
    this.currentPopulation = Math.max(1, Math.round(this.currentPopulation)); // Prevent extinction

    // Update UI and map
    this.updateInterface();
    this.mapView.updateTiles(tiles.toArray());

    // Log important events
    if (starvationDeaths > 0) {
      console.log(`Starvation: ${starvationDeaths} deaths due to food shortage`);
    }
    if (newBirths > 5) {
      console.log(`Population boom: ${newBirths} new citizens`);
    }
  }

  updateInterface() {
    document.getElementById("clock").innerHTML = new Date(
      this.currentTime
    ).toDateString();

    const speedIndicator = document.getElementById("speed-indicator");
    if (speedIndicator) {
      speedIndicator.textContent = `${this.simulationSpeed}x`;
    }

    document.getElementById("calories-value").innerHTML =
      this.currentCalories.toFixed(0);
    document.getElementById("protein-value").innerHTML =
      this.currentProtein.toFixed(0);
    document.getElementById("food-value").innerHTML =
      this.currentFood.toFixed(0);
    document.getElementById("population-value").innerHTML =
      this.currentPopulation.toFixed(0);
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

  getWeather(timestamp: number, location: string): Weather | null {
    try {
      const result = this.weather_data.find(entry =>
          entry.UNIXTimestamp === timestamp && entry.Location === location
      );

      if (!result) return null; // Handle case when no matching entry is found

      return {
        temperature: result.AirTemperatureCelsius,
        Precipitation_mm: result.Precipitation_mm
      };
    } catch (error) {
      console.error("Error loading weather data:", error);
      return null;
    }
  }
}
