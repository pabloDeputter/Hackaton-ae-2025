var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "./interfaces"], function (require, exports, interfaces_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulator = /** @class */ (function () {
        function Simulator(mapview) {
            this.currentPopulation = 0;
            this.currentFood = 1000;
            this.currentTime = new Date().getTime();
            this.lockedLocations = [
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
            this.mapView = mapview;
        }
        Simulator.prototype.lockTiles = function () {
            var _this = this;
            var tiles = this.mapView.getTileGrid();
            tiles.forEachQR(function (q, r, tile) {
                if (_this.lockedLocations.some(function (loc) { return loc.name === tile.location; })) {
                    tile.locked = true;
                    tile.fog = true;
                }
                else {
                    tile.locked = false;
                    tile.fog = false;
                }
            });
            this.mapView.updateTiles(tiles.toArray());
        };
        Simulator.prototype.start = function () {
            var _this = this;
            this.lockTiles();
            var interval = setInterval(function () {
                _this.nextStep();
            }, 1000);
        };
        Simulator.prototype.nextStep = function () {
            var _this = this;
            this.currentTime += 24 * 60 * 60 * 1000;
            this.currentPopulation += 10;
            if (this.currentPopulation >= this.lockedLocations[0].value) {
                this.lockedLocations.shift();
                this.lockTiles();
            }
            this.updateInterface();
            var tiles = this.mapView.getTileGrid();
            tiles.forEachQR(function (q, r, tile) {
                if (tile.plant) {
                    tile.plant = _this.progressPlantGrowth(tile.plant);
                    if (tile.plant.growthStage == interfaces_1.GrowthStage.Harvestable) {
                        console.log("Growth stage", tile.plant);
                        _this.currentFood += tile.plant.kcalPer100g * tile.plant.weightWhenFullGrown;
                        tile.plant.growthStage = interfaces_1.GrowthStage.Seed;
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
        };
        Simulator.prototype.updateInterface = function () {
            document.getElementById("clock").innerHTML = new Date(this.currentTime).toDateString();
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
        return Simulator;
    }());
    exports.Simulator = Simulator;
});
//# sourceMappingURL=Simulator.js.map