var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "./interfaces", "./util"], function (require, exports, interfaces_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulator = /** @class */ (function () {
        function Simulator() {
            this.currentPopulation = 10;
            this.currentFood = 1000;
            this.currentProtein = 0;
            this.currentCalories = 0;
            this.currentTime = 1672524000 * 1000;
            // Add demographic variables
            this.birthRate = 0.5; // 1% chance of new birth per step
            this.deathRate = 0.005; // 0.5% natural death rate per step
            this.foodPerPersonPerDay = 40; // Base food requirement
            this.starvationThreshold = 0.7; // Below 70% of required food causes starvation
            this.starvationDeathRate = 0.2; // 5% death rate during starvation
            // New properties for simulation control
            this.isPaused = false;
            this.simulationSpeed = 1; // Default speed multiplier
            // @ts-ignore
            this.intervalId = null;
            this.lockedLocations = [
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
        }
        Simulator.prototype.setMapVieuw = function (mapview) {
            var _this = this;
            this.mapView = mapview;
            util_1.loadWeatherJSON().then(function (data) {
                _this.weather_data = data;
            });
        };
        Simulator.prototype.lockTiles = function () {
            var _this = this;
            var tiles = this.mapView.getTileGrid();
            tiles.forEachQR(function (q, r, tile) {
                if (_this.lockedLocations.some(function (loc) { return loc.name === tile.location; })) {
                    tile.locked = true;
                    tile.fog = true;
                }
                else if (tile.location) {
                    tile.locked = false;
                    tile.fog = false;
                }
            });
            this.mapView.updateTiles(tiles.toArray());
        };
        Simulator.prototype.start = function () {
            this.lockTiles();
            this.setupControls();
            this.startInterval();
        };
        Simulator.prototype.startInterval = function () {
            var _this = this;
            // Clear existing interval if any
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            // Calculate interval based on speed (smaller interval = faster simulation)
            var intervalTime = Math.floor(1500 / this.simulationSpeed);
            this.intervalId = setInterval(function () {
                if (!_this.isPaused) {
                    _this.nextStep();
                }
            }, intervalTime);
        };
        Simulator.prototype.setupControls = function () {
            var _this = this;
            // Set up pause button
            var pauseButton = document.getElementById("pauseButton");
            if (pauseButton) {
                pauseButton.addEventListener("click", function () {
                    _this.togglePause();
                    _this.updatePauseButtonText();
                });
            }
            // Set up slow button
            var slowButton = document.getElementById("slowButton");
            if (slowButton) {
                slowButton.addEventListener("click", function () {
                    _this.decreaseSpeed();
                });
            }
            // Set up fast button
            var fastButton = document.getElementById("fastButton");
            if (fastButton) {
                fastButton.addEventListener("click", function () {
                    _this.increaseSpeed();
                });
            }
        };
        Simulator.prototype.togglePause = function () {
            this.isPaused = !this.isPaused;
            console.log("Simulation " + (this.isPaused ? "paused" : "resumed"));
        };
        Simulator.prototype.updatePauseButtonText = function () {
            var pauseButton = document.getElementById("pauseButton");
            if (pauseButton) {
                pauseButton.innerHTML = this.isPaused
                    ? "        <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\" class=\"h-4 w-4\">\n          <path\n            d=\"M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z\"\n          />\n        </svg>\n        Play"
                    : "        <svg\n          xmlns=\"http://www.w3.org/2000/svg\"\n          viewBox=\"0 0 320 512\"\n          class=\"h-4 w-4\"\n        >\n          <path\n            d=\"M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z\"\n          />\n        </svg>\n        Pause";
            }
        };
        Simulator.prototype.increaseSpeed = function () {
            // Maximum speed is 5x
            this.simulationSpeed = Math.min(5, this.simulationSpeed + 0.5);
            console.log("Simulation speed: " + this.simulationSpeed + "x");
            this.startInterval(); // Restart with new speed
        };
        Simulator.prototype.decreaseSpeed = function () {
            // Minimum speed is 0.5x
            this.simulationSpeed = Math.max(0.5, this.simulationSpeed - 0.5);
            console.log("Simulation speed: " + this.simulationSpeed + "x");
            this.startInterval(); // Restart with new speed
        };
        Simulator.prototype.nextStep = function () {
            var _this = this;
            this.currentTime += 24 * 60 * 60 * 1000; // Add one day
            // Unlock new locations if population threshold is reached
            if (this.lockedLocations.length > 0 &&
                this.currentPopulation >= this.lockedLocations[0].value) {
                this.lockedLocations.shift();
                this.lockTiles();
            }
            // Process plant growth and harvests
            var tiles = this.mapView.getTileGrid();
            var newCalories = 0;
            var newProtein = 0;
            tiles.forEachQR(function (q, r, tile) {
                if (tile.plant) {
                    tile.plant = _this.progressPlantGrowth(tile.plant);
                    console.log(tile.plant);
                    // Harvest plants when ready
                    if (tile.plant.daysSincePlanted >= tile.plant.timeToConsumable) {
                        // Calculate nutritional yield from harvest
                        newCalories +=
                            tile.plant.kcalPer100g * tile.plant.weightWhenFullGrown;
                        newProtein +=
                            tile.plant.proteinsPer100g * tile.plant.weightWhenFullGrown;
                        // Reset plant to seed stage
                        tile.plant.growthStage = interfaces_1.GrowthStage.Seed;
                        tile.plant.daysSincePlanted = 0;
                        tile.terrain = "green_plant";
                    }
                    else if (tile.plant.growthStage == interfaces_1.GrowthStage.Dead) {
                        tile.terrain = "red_plant";
                    }
                    else {
                        tile.terrain = "orange_plant";
                    }
                    if (_this.activeTile.q == tile.q && _this.activeTile.r == tile.r) {
                        var growthPercentage = (tile.plant.daysSincePlanted / tile.plant.timeToConsumable) * 100;
                        try {
                            // @ts-ignore
                            document.getElementById("progress_bar").style = "width: " + Math.min(growthPercentage, 100) + "%";
                            document.getElementById("progress_bar_text").innerHTML = "" + growthPercentage.toFixed(1) + "%";
                        }
                        catch (error) { }
                    }
                }
            });
            // Add harvested nutrients to stockpile
            this.currentCalories += newCalories;
            this.currentProtein += newProtein;
            // Calculate food consumption based on population
            var foodRequired = this.currentPopulation * this.foodPerPersonPerDay;
            console.log("Food required: " + foodRequired + " kcal");
            // Update food supply (calories + protein converted to energy)
            this.currentFood += this.currentCalories + this.currentProtein * 4;
            // Consume food
            var foodAvailableRatio = Math.min(1, this.currentFood / foodRequired);
            this.currentFood -= foodRequired * foodAvailableRatio;
            // Population dynamics
            var newBirths = 0;
            var naturalDeaths = 0;
            var starvationDeaths = 0;
            // Calculate births and deaths
            if (foodAvailableRatio >= this.starvationThreshold) {
                // Normal conditions - births and natural deaths
                newBirths = Math.floor(this.currentPopulation *
                    this.birthRate *
                    (foodAvailableRatio > 0.9 ? 1.2 : 1));
                naturalDeaths = Math.floor(this.currentPopulation * this.deathRate);
            }
            else {
                // Starvation conditions - reduced births, increased deaths
                newBirths = Math.floor(this.currentPopulation * this.birthRate * 0.5);
                naturalDeaths = Math.floor(this.currentPopulation * this.deathRate);
                starvationDeaths = Math.floor(this.currentPopulation *
                    this.starvationDeathRate *
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
                console.log("Starvation: " + starvationDeaths + " deaths due to food shortage");
            }
            if (newBirths > 5) {
                console.log("Population boom: " + newBirths + " new citizens");
            }
        };
        Simulator.prototype.updateInterface = function () {
            document.getElementById("clock").innerHTML = new Date(this.currentTime).toDateString();
            var speedIndicator = document.getElementById("speed-indicator");
            if (speedIndicator) {
                speedIndicator.textContent = this.simulationSpeed + "x";
            }
            document.getElementById("calories-value").innerHTML =
                this.currentCalories.toFixed(0);
            document.getElementById("protein-value").innerHTML =
                this.currentProtein.toFixed(0);
            document.getElementById("food-value").innerHTML =
                this.currentFood.toFixed(0);
            document.getElementById("population-value").innerHTML =
                this.currentPopulation.toFixed(0);
        };
        Simulator.prototype.progressPlantGrowth = function (plant) {
            var daysSincePlanted = plant.daysSincePlanted, timeToConsumable = plant.timeToConsumable;
            // Determine the growth stage based on progression percentage
            var growthPercentage = (daysSincePlanted / timeToConsumable) * 100;
            var newGrowthStage;
            if (growthPercentage < 20) {
                newGrowthStage = interfaces_1.GrowthStage.Seed;
            }
            else if (growthPercentage < 40) {
                newGrowthStage = interfaces_1.GrowthStage.Sprout;
            }
            else if (growthPercentage < 60) {
                newGrowthStage = interfaces_1.GrowthStage.Young;
            }
            else if (growthPercentage < 80) {
                newGrowthStage = interfaces_1.GrowthStage.Mature;
            }
            else if (growthPercentage < 100) {
                newGrowthStage = interfaces_1.GrowthStage.Harvestable;
            }
            else {
                newGrowthStage = interfaces_1.GrowthStage.Dead; // Plant dies after full maturity
            }
            return __assign({}, plant, { daysSincePlanted: plant.daysSincePlanted + 1, growthStage: newGrowthStage });
        };
        Simulator.prototype.getWeather = function (timestamp, location) {
            try {
                // @ts-ignore
                var result = this.weather_data.find(function (entry) {
                    return entry.UNIXTimestamp === timestamp && entry.Location === location;
                });
                if (!result)
                    return null; // Handle case when no matching entry is found
                return {
                    temperature: result.AirTemperatureCelsius,
                    Precipitation_mm: result.Precipitation_mm
                };
            }
            catch (error) {
                console.error("Error loading weather data:", error);
                return null;
            }
        };
        Simulator.prototype.setActiveCell = function (tile) {
            this.activeTile = tile;
        };
        return Simulator;
    }());
    exports.Simulator = Simulator;
});
//# sourceMappingURL=Simulator.js.map