var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../../src/MapView", "../../src/util", "../../src/map-generator", "three"], function (require, exports, MapView_1, util_1, map_generator_1, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function asset(relativePath) {
        return "../../assets/" + relativePath;
    }
    function loadTextureAtlas() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, util_1.loadJSON(asset("land-atlas.json"))];
            });
        });
    }
    function generateMap(mapSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, map_generator_1.generateIsland(mapSize)];
            });
        });
    }
    function initView(mapSize, initialZoom) {
        return __awaiter(this, void 0, void 0, function () {
            var textureLoader, loadTexture, options, _a, map, atlas, mapView, dialog;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        textureLoader = new three_1.TextureLoader();
                        loadTexture = function (name) { return textureLoader.load(asset(name)); };
                        options = {
                            terrainAtlas: null,
                            terrainAtlasTexture: loadTexture("terrain.png"),
                            hillsNormalTexture: loadTexture("hills-normal.png"),
                            coastAtlasTexture: loadTexture("coast-diffuse.png"),
                            riverAtlasTexture: loadTexture("river-diffuse.png"),
                            undiscoveredTexture: loadTexture("paper.jpg"),
                            transitionTexture: loadTexture("transitions.png"),
                            treeSpritesheet: loadTexture("trees.png"),
                            treeSpritesheetSubdivisions: 4,
                        };
                        return [4 /*yield*/, Promise.all([
                                generateMap(mapSize),
                                loadTextureAtlas(),
                            ])];
                    case 1:
                        _a = _b.sent(), map = _a[0], atlas = _a[1];
                        options.terrainAtlas = atlas;
                        mapView = new MapView_1.default();
                        mapView.zoom = initialZoom;
                        mapView.load(map, options);
                        // Create plant selection dialog if it doesn't exist
                        // Create plant selection dialog if it doesn't exist
                        if (!document.getElementById("plantDialog")) {
                            dialog = document.createElement("div");
                            dialog.id = "plantDialog";
                            dialog.className =
                                "hidden fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 shadow-lg";
                            dialog.innerHTML = "\n            <div class=\"bg-gray-100 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col shadow-xl\">\n                <div class=\"flex justify-between items-center mb-4\">\n                    <h2 class=\"text-xl font-bold text-gray-800\">Available Plants</h2>\n                    <button id=\"closePlantDialog\" class=\"text-gray-500 hover:text-gray-700\">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\" />\n                        </svg>\n                    </button>\n                </div>\n                <div class=\"text-gray-600 mb-2\">\n                    <span id=\"plantDialogLocation\" class=\"font-medium\"></span>\n                </div>\n                <div id=\"plantsContainer\" class=\"overflow-y-auto flex-grow\">\n                    <p id=\"loadingPlants\" class=\"text-gray-500\">Loading available plants...</p>\n                    <div id=\"plantsList\" class=\"grid grid-cols-1 gap-2\"></div>\n                </div>\n            </div>\n        ";
                            document.body.appendChild(dialog);
                            document
                                .getElementById("closePlantDialog")
                                .addEventListener("click", function () {
                                document.getElementById("plantDialog").classList.add("hidden");
                            });
                            // Prevent scroll events from affecting the map
                            dialog.addEventListener("wheel", function (e) {
                                e.stopPropagation();
                            }, { passive: false });
                            // Also prevent touchmove events for mobile
                            dialog.addEventListener("touchmove", function (e) {
                                e.stopPropagation();
                            }, { passive: false });
                        }
                        mapView.onTileSelected = function (tile) {
                            // If tile has plant already, show plant data
                            if (tile.plant) {
                                var plantDialog_1 = document.getElementById("plantDialog");
                                var plantDialogLocation = document.getElementById("plantDialogLocation");
                                var plantsList = document.getElementById("plantsList");
                                var loadingPlants = document.getElementById("loadingPlants");
                                // Show the dialog with blurred backdrop
                                plantDialog_1.classList.remove("hidden");
                                plantDialog_1.classList.add("backdrop-blur-[2px]");
                                plantDialogLocation.textContent = "Location: " + (tile.location || "Unknown") + " - Planted: " + tile.plant.name;
                                plantsList.innerHTML = "";
                                loadingPlants.classList.add("hidden");
                                // Make dialog wider
                                var dialogContent = plantDialog_1.querySelector("div");
                                dialogContent.className =
                                    "bg-gray-100 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col shadow-xl";
                                // Create plant stats display
                                var plantStats = document.createElement("div");
                                plantStats.className = "bg-white p-4 rounded-lg shadow";
                                tile.plant.daysSincePlanted = tile.plant.timeToConsumable;
                                // Calculate days until harvest
                                var daysLeft = tile.plant.timeToConsumable - tile.plant.daysSincePlanted;
                                var growthPercentage = (tile.plant.daysSincePlanted / tile.plant.timeToConsumable) * 100;
                                plantStats.innerHTML = "\n          <div class=\"flex flex-col gap-4\">\n            <div class=\"flex justify-between items-center\">\n              <h3 class=\"text-xl font-bold text-gray-800\">" + tile.plant.name + "</h3>\n            </div>\n            \n            <div class=\"grid grid-cols-2 gap-4\">\n              <div>\n                <h4 class=\"font-medium text-gray-700\">Growth Information</h4>\n                <ul class=\"mt-2 space-y-1\">\n                  <li><span class=\"font-medium\">Growth Stage:</span> " + tile.plant.growthStage + "</li>\n                  <li><span class=\"font-medium\">Days Since Planted:</span> " + tile.plant.daysSincePlanted + "</li>\n                  <li><span class=\"font-medium\">Days Until Harvest:</span> " + (daysLeft > 0 ? daysLeft : "Ready to harvest!") + "</li>\n                </ul>\n              </div>\n              \n              <div>\n                <h4 class=\"font-medium text-gray-700\">Nutritional Information</h4>\n                <ul class=\"mt-2 space-y-1\">\n                  <li><span class=\"font-medium\">Expected Weight:</span> " + tile.plant.weightWhenFullGrown + " kg</li>\n                  <li><span class=\"font-medium\">Calories:</span> " + tile.plant.kcalPer100g + " kcal per 100g</li>\n                  <li><span class=\"font-medium\">Protein:</span> " + tile.plant.proteinsPer100g + " g per 100g</li>\n                </ul>\n              </div>\n            </div>\n            \n            <div>\n              <h4 class=\"font-medium text-gray-700\">Growth Progress</h4>\n              <div class=\"w-full bg-gray-200 rounded-full h-2.5 mt-2\">\n                <div class=\"bg-green-600 h-2.5 rounded-full\" style=\"width: " + Math.min(growthPercentage, 100) + "%\"></div>\n              </div>\n              <p class=\"text-sm text-gray-600 mt-1\">" + growthPercentage.toFixed(1) + "% complete</p>\n            </div>\n            \n            <div class=\"flex justify-end gap-2 mt-2\">\n              " + (daysLeft <= 0
                                    ? "\n              <button id=\"harvestPlant\" class=\"bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded\">\n                Harvest Plant\n              </button>\n              "
                                    : "") + "\n            </div>\n          </div>\n        ";
                                plantsList.appendChild(plantStats);
                                // Add event listener for harvest button if it exists
                                var harvestBtn = document.getElementById("harvestPlant");
                                if (harvestBtn) {
                                    harvestBtn.addEventListener("click", function () {
                                        // Logic for harvesting
                                        alert("Harvested " + tile.plant.name + "!");
                                        delete tile.plant;
                                        // TODO - gamelogic
                                        tile.terrain = "plains";
                                        mapView.updateTiles([tile]);
                                        plantDialog_1.classList.add("hidden");
                                    });
                                }
                                return; // Exit early - don't proceed to the location-based plant selection
                            }
                            document.getElementById("currentTile").innerHTML =
                                "Tile data " + tile.r + " " + tile.q;
                            // If the tile has a location, show the plant selection dialog
                            if (tile.location) {
                                var plantDialog = document.getElementById("plantDialog");
                                var plantDialogLocation = document.getElementById("plantDialogLocation");
                                var plantsList_1 = document.getElementById("plantsList");
                                var loadingPlants_1 = document.getElementById("loadingPlants");
                                // Show the dialog with blurred backdrop
                                plantDialog.classList.remove("hidden");
                                plantDialog.classList.add("backdrop-blur-[2px]");
                                plantDialogLocation.textContent = "Location: " + tile.location;
                                plantsList_1.innerHTML = "";
                                loadingPlants_1.classList.remove("hidden");
                                // Make dialog wider
                                var dialogContent = plantDialog.querySelector("div");
                                dialogContent.className =
                                    "bg-gray-100 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col shadow-xl";
                                // Fetch available plants for this location
                                fetch("http://127.0.0.1:8000/getPlants/" + tile.location, {
                                    method: "GET",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                    },
                                })
                                    .then(function (response) {
                                    if (!response.ok) {
                                        throw new Error("HTTP error! Status: " + response.status);
                                    }
                                    return response.json();
                                })
                                    .then(function (plants) {
                                    loadingPlants_1.classList.add("hidden");
                                    if (plants.length === 0) {
                                        plantsList_1.innerHTML =
                                            '<p class="text-gray-500">No plants available for this location.</p>';
                                        return;
                                    }
                                    // Add table with headers and descriptions
                                    var tableContainer = document.createElement("div");
                                    tableContainer.className = "overflow-x-auto";
                                    tableContainer.innerHTML = "\n                    <table class=\"w-full text-sm text-left\">\n                        <thead class=\"text-xs text-gray-700 uppercase bg-gray-50\">\n                            <tr>\n                                <th class=\"px-4 py-2\" title=\"Common name of the plant\">Name</th>\n                                <th class=\"px-4 py-2\" title=\"Optimal climate for growth\">Growth Climate</th>\n                                <th class=\"px-4 py-2\" title=\"How much water the plant needs\">Watering Needs</th>\n                                <th class=\"px-4 py-2\" title=\"Days until harvest is possible\">Time To Harvest</th>\n                                <th class=\"px-4 py-2\" title=\"Calories per 100g\">Calories per 100g (kcal)</th>\n                                <th class=\"px-4 py-2\" title=\"Protein content per 100g\">Protein per 100g (g)</th>\n                                <th class=\"px-4 py-2\" title=\"Match with this area's climate (higher is better)\">Climate Score</th>\n                                <th class=\"px-4 py-2\" title=\"How fast this plant grows (higher is better)\">Growth Speed</th>\n                                <th class=\"px-4 py-2\" title=\"Nutritional value (higher is better)\">Nutrition</th>\n                                <th class=\"px-4 py-2\" title=\"Water efficiency (higher is better)\">Water Efficiency</th>\n                                <th class=\"px-4 py-2\" title=\"Total score (higher is better)\">Total Score</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"plantsTableBody\">\n                        </tbody>\n                    </table>\n                ";
                                    plantsList_1.appendChild(tableContainer);
                                    var tableBody = document.getElementById("plantsTableBody");
                                    plants.forEach(function (plant) {
                                        // Init. Plant object according to interface
                                        plant = {
                                            name: plant["Name"],
                                            latinName: plant["Latin Name"],
                                            growthClimate: plant["Ideal growth Climate"],
                                            wateringNeeds: plant["Watering Needs"],
                                            timeToConsumable: plant["Time to Consumable (days)"],
                                            weightWhenFullGrown: plant["Weight when Full Grown (kg)"],
                                            kcalPer100g: plant["Kcal per 100g"],
                                            proteinsPer100g: plant["Proteins per 100g (g)"],
                                            growthStage: "Seed",
                                            daysSincePlanted: 0,
                                            climateScore: plant["Climate_Score"],
                                            growthSpeed: plant["Growth_Speed"],
                                            nutritionScore: plant["Nutrition_Score"],
                                            waterEfficiency: plant["Water_Efficiency"],
                                            totalScore: plant["Total_Score"],
                                        };
                                        var row = document.createElement("tr");
                                        row.className = "bg-white border-b hover:bg-gray-50 cursor-pointer";
                                        row.innerHTML = "\n                        <td class=\"px-4 py-2 font-medium text-gray-800\">" + plant.name + "</td>\n                        <td class=\"px-4 py-2\">" + plant.growthClimate + "</td>\n                        <td class=\"px-4 py-2\">" + plant.wateringNeeds + "</td>\n                        <td class=\"px-4 py-2\">" + plant.timeToConsumable + " days</td>\n                        <td class=\"px-4 py-2\">" + plant.kcalPer100g + "</td>\n                        <td class=\"px-4 py-2\">" + plant.proteinsPer100g + "</td>\n                        <td class=\"px-4 py-2\"><span class=\"px-2 py-1 rounded " + (plant.climateScore >= 0.7
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800") + "\">" + plant.climateScore + "</span></td>\n                        <td class=\"px-4 py-2\"><span class=\"px-2 py-1 rounded " + (plant.growthSpeed >= 0.7
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800") + "\">" + plant.growthSpeed + "</span></td>\n                        <td class=\"px-4 py-2\"><span class=\"px-2 py-1 rounded " + (plant.nutritionScore >= 0.7
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800") + "\">" + plant.nutritionScore + "</span></td>\n                        <td class=\"px-4 py-2\"><span class=\"px-2 py-1 rounded " + (plant.waterEfficiency >= 2
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800") + "\">" + plant.waterEfficiency + "</span></td>\n                        <td class=\"px-4 py-2\"><span class=\"px-2 py-1 rounded " + (plant.totalScore >= 0.7
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800") + "\">" + plant.totalScore + "</span></td>\n                    ";
                                        // Make the entire row clickable to show plant info
                                        row.addEventListener("click", function () {
                                            var plantDialog = document.getElementById("plantDialog");
                                            var plantsList = document.getElementById("plantsList");
                                            // Create and show detailed plant info
                                            plantsList.innerHTML = "\n                    <div class=\"bg-white p-4 rounded-lg shadow\">\n                        <h3 class=\"text-xl font-bold text-gray-800 mb-4\">" + plant.name + "</h3>\n                        <div class=\"grid grid-cols-2 gap-4\">\n                            <div>\n                                <p><span class=\"font-medium\">Latin Name:</span> " + plant.latinName + "</p>\n                                <p><span class=\"font-medium\">Growth Climate:</span> " + plant.growthClimate + "</p>\n                                <p><span class=\"font-medium\">Watering Needs:</span> " + plant.wateringNeeds + "</p>\n                                <p><span class=\"font-medium\">Time to Harvest:</span> " + plant.timeToConsumable + " days</p>\n                            </div>\n                            <div>\n                                <p><span class=\"font-medium\">Weight when Grown:</span> " + plant.weightWhenFullGrown + " kg</p>\n                                <p><span class=\"font-medium\">Calories:</span> " + plant.kcalPer100g + " kcal/100g</p>\n                                <p><span class=\"font-medium\">Protein:</span> " + plant.proteinsPer100g + "g/100g</p>\n                            </div>\n                        </div>\n                        <button class=\"mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded\">Plant</button>\n                    </div>\n                ";
                                            // Add click handler to the new plant button
                                            plantsList
                                                .querySelector("button")
                                                .addEventListener("click", function () {
                                                tile.plant = plant;
                                                tile.terrain = "tundra";
                                                mapView.updateTiles([tile]);
                                                plantDialog.classList.add("hidden");
                                            });
                                        });
                                        tableBody.appendChild(row);
                                    });
                                })
                                    .catch(function (error) {
                                    console.error("Error fetching plants:", error);
                                    loadingPlants_1.classList.add("hidden");
                                    plantsList_1.innerHTML = "<p class=\"text-red-500\">Error loading plants: " + error.message + "</p>";
                                });
                            }
                            else {
                                // If no location, just update the terrain as before
                                console.log("no location");
                                tile.terrain = "plains";
                            }
                            mapView.updateTiles([tile]);
                        };
                        return [2 /*return*/, mapView];
                }
            });
        });
    }
    exports.initView = initView;
    /**
     * @param fog whether there should be fog on this tile making it appear darker
     * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
     * @param range number of tiles around the given tile that should be updated
     * @param tile tile around which fog should be updated
     */
    function setFogAround(mapView, tile, range, fog, clouds) {
        var tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range);
        var updated = tiles.map(function (t) {
            t.fog = fog;
            t.clouds = clouds;
            return t;
        });
        mapView.updateTiles(updated);
    }
});
//# sourceMappingURL=view.js.map