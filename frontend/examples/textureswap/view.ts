import MapView from "../../src/MapView";
import { loadFile, loadJSON, loadTexture } from "../../src/util";
import {
  TextureAtlas,
  isMountain,
  isWater,
  TileData,
} from "../../src/interfaces";
import { generateIsland, generateRandomMap } from "../../src/map-generator";
import { varying } from "./util";
import { TextureLoader } from "three";
import { MapMeshOptions } from "../../src/MapMesh";

function asset(relativePath: string): string {
  return "../../assets/" + relativePath;
}

async function loadTextureAtlas() {
  return loadJSON<TextureAtlas>(asset("land-atlas.json"));
}

async function generateMap(mapSize: number) {
  return generateIsland(mapSize);
  /*return generateRandomMap(mapSize, (q, r, height) => {
        const terrain = (height < 0 && "ocean") || (height > 0.75 && "mountain") || varying("grass", "plains")
        const trees = !isMountain(height) && !isWater(height) && varying(true, false) ?
            Math.floor(Math.random()*2) : undefined
        return {q, r, height, terrain, treeIndex: trees, rivers: null, fog: false, clouds: false }
    })*/
}

export async function initView(
  mapSize: number,
  initialZoom: number
): Promise<MapView> {
  const textureLoader = new TextureLoader();
  const loadTexture = (name: string) => textureLoader.load(asset(name));
  const options: MapMeshOptions = {
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
  const [map, atlas] = await Promise.all([
    generateMap(mapSize),
    loadTextureAtlas(),
  ]);
  options.terrainAtlas = atlas;

  const mapView = new MapView();
  mapView.zoom = initialZoom;
  mapView.load(map, options);

  // Create plant selection dialog if it doesn't exist
  // Create plant selection dialog if it doesn't exist
  if (!document.getElementById("plantDialog")) {
    const dialog = document.createElement("div");
    dialog.id = "plantDialog";
    dialog.className =
      "hidden fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 shadow-lg";
    dialog.innerHTML = `
            <div class="bg-gray-100 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col shadow-xl">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-800">Available Plants</h2>
                    <button id="closePlantDialog" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="text-gray-600 mb-2">
                    <span id="plantDialogLocation" class="font-medium"></span>
                </div>
                <div id="plantsContainer" class="overflow-y-auto flex-grow">
                    <p id="loadingPlants" class="text-gray-500">Loading available plants...</p>
                    <div id="plantsList" class="grid grid-cols-1 gap-2"></div>
                </div>
            </div>
        `;
    document.body.appendChild(dialog);

    document
      .getElementById("closePlantDialog")
      .addEventListener("click", () => {
        document.getElementById("plantDialog").classList.add("hidden");
      });

    // Prevent scroll events from affecting the map
    dialog.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );

    // Also prevent touchmove events for mobile
    dialog.addEventListener(
      "touchmove",
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );
  }

  mapView.onTileSelected = (tile: TileData) => {
    // If tile has plant already, show plant data
    if (tile.plant) {
      const plantDialog = document.getElementById("plantDialog");
      const plantDialogLocation = document.getElementById(
        "plantDialogLocation"
      );
      const plantsList = document.getElementById("plantsList");
      const loadingPlants = document.getElementById("loadingPlants");

      // Show the dialog with blurred backdrop
      plantDialog.classList.remove("hidden");
      plantDialog.classList.add("backdrop-blur-[2px]");
      plantDialogLocation.textContent = `Location: ${
        tile.location || "Unknown"
      } - Planted: ${tile.plant.name}`;
      plantsList.innerHTML = "";
      loadingPlants.classList.add("hidden");

      // Make dialog wider
      const dialogContent = plantDialog.querySelector("div");
      dialogContent.className =
        "bg-gray-100 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col shadow-xl";

      // Create plant stats display
      const plantStats = document.createElement("div");
      plantStats.className = "bg-white p-4 rounded-lg shadow";

      tile.plant.daysSincePlanted = tile.plant.timeToConsumable;

      // Calculate days until harvest
      const daysLeft =
        tile.plant.timeToConsumable - tile.plant.daysSincePlanted;
      const growthPercentage =
        (tile.plant.daysSincePlanted / tile.plant.timeToConsumable) * 100;
      plantStats.innerHTML = `
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-gray-800">${
                tile.plant.name
              }</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-gray-700">Growth Information</h4>
                <ul class="mt-2 space-y-1">
                  <li><span class="font-medium">Growth Stage:</span> ${
                    tile.plant.growthStage
                  }</li>
                  <li><span class="font-medium">Days Since Planted:</span> ${
                    tile.plant.daysSincePlanted
                  }</li>
                  <li><span class="font-medium">Days Until Harvest:</span> ${
                    daysLeft > 0 ? daysLeft : "Ready to harvest!"
                  }</li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700">Nutritional Information</h4>
                <ul class="mt-2 space-y-1">
                  <li><span class="font-medium">Expected Weight:</span> ${
                    tile.plant.weightWhenFullGrown
                  } kg</li>
                  <li><span class="font-medium">Calories:</span> ${
                    tile.plant.kcalPer100g
                  } kcal per 100g</li>
                  <li><span class="font-medium">Protein:</span> ${
                    tile.plant.proteinsPer100g
                  } g per 100g</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-700">Growth Progress</h4>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="bg-green-600 h-2.5 rounded-full" style="width: ${Math.min(
                  growthPercentage,
                  100
                )}%"></div>
              </div>
              <p class="text-sm text-gray-600 mt-1">${growthPercentage.toFixed(
                1
              )}% complete</p>
            </div>
            
            <div class="flex justify-end gap-2 mt-2">
              ${
                daysLeft <= 0
                  ? `
              <button id="harvestPlant" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Harvest Plant
              </button>
              `
                  : ""
              }
            </div>
          </div>
        `;

      plantsList.appendChild(plantStats);

      // Add event listener for harvest button if it exists
      const harvestBtn = document.getElementById("harvestPlant");
      if (harvestBtn) {
        harvestBtn.addEventListener("click", () => {
          // Logic for harvesting
          alert(`Harvested ${tile.plant.name}!`);
          delete tile.plant;
          // TODO - update game state with harvested plant
          tile.terrain = "grass";
          mapView.updateTiles([tile]);
          plantDialog.classList.add("hidden");
        });
      }

      return; // Exit early - don't proceed to the location-based plant selection
    }

    document.getElementById("currentTile").innerHTML =
      "Tile data " + tile.r + " " + tile.q;

    // If the tile has a location, show the plant selection dialog
    if (tile.location) {
      const plantDialog = document.getElementById("plantDialog");
      const plantDialogLocation = document.getElementById(
        "plantDialogLocation"
      );
      const plantsList = document.getElementById("plantsList");
      const loadingPlants = document.getElementById("loadingPlants");

      // Show the dialog with blurred backdrop
      plantDialog.classList.remove("hidden");
      plantDialog.classList.add("backdrop-blur-[2px]");
      plantDialogLocation.textContent = `Location: ${tile.location}`;
      plantsList.innerHTML = "";
      loadingPlants.classList.remove("hidden");

      // Make dialog wider
      const dialogContent = plantDialog.querySelector("div");
      dialogContent.className =
        "bg-gray-100 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col shadow-xl";

      // Fetch available plants for this location
      fetch(`http://127.0.0.1:8000/getPlants/${tile.location}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((plants) => {
          loadingPlants.classList.add("hidden");

          if (plants.length === 0) {
            plantsList.innerHTML =
              '<p class="text-gray-500">No plants available for this location.</p>';
            return;
          }

          // Add table with headers and descriptions
          const tableContainer = document.createElement("div");
          tableContainer.className = "overflow-x-auto";
          tableContainer.innerHTML = `
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-4 py-2" title="Common name of the plant">Name</th>
                                <th class="px-4 py-2" title="Optimal climate for growth">Growth Climate</th>
                                <th class="px-4 py-2" title="How much water the plant needs">Watering Needs</th>
                                <th class="px-4 py-2" title="Days until harvest is possible">Time To Harvest</th>
                                <th class="px-4 py-2" title="Calories per 100g">Calories per 100g (kcal)</th>
                                <th class="px-4 py-2" title="Protein content per 100g">Protein per 100g (g)</th>
                                <th class="px-4 py-2" title="Match with this area's climate (higher is better)">Climate Score</th>
                                <th class="px-4 py-2" title="How fast this plant grows (higher is better)">Growth Speed</th>
                                <th class="px-4 py-2" title="Nutritional value (higher is better)">Nutrition</th>
                                <th class="px-4 py-2" title="Water efficiency (higher is better)">Water Efficiency</th>
                                <th class="px-4 py-2" title="Total score (higher is better)">Total Score</th>
                            </tr>
                        </thead>
                        <tbody id="plantsTableBody">
                        </tbody>
                    </table>
                `;
          plantsList.appendChild(tableContainer);

          const tableBody = document.getElementById("plantsTableBody");

          plants.forEach((plant: any) => {
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

            const row = document.createElement("tr");
            row.className = "bg-white border-b hover:bg-gray-50 cursor-pointer";

            row.innerHTML = `
                        <td class="px-4 py-2 font-medium text-gray-800">${
                          plant.name
                        }</td>
                        <td class="px-4 py-2">${plant.growthClimate}</td>
                        <td class="px-4 py-2">${plant.wateringNeeds}</td>
                        <td class="px-4 py-2">${
                          plant.timeToConsumable
                        } days</td>
                        <td class="px-4 py-2">${plant.kcalPer100g}</td>
                        <td class="px-4 py-2">${plant.proteinsPer100g}</td>
                        <td class="px-4 py-2"><span class="px-2 py-1 rounded ${
                          plant.climateScore >= 0.7
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">${plant.climateScore}</span></td>
                        <td class="px-4 py-2"><span class="px-2 py-1 rounded ${
                          plant.growthSpeed >= 0.7
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">${plant.growthSpeed}</span></td>
                        <td class="px-4 py-2"><span class="px-2 py-1 rounded ${
                          plant.nutritionScore >= 0.7
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">${plant.nutritionScore}</span></td>
                        <td class="px-4 py-2"><span class="px-2 py-1 rounded ${
                          plant.waterEfficiency >= 2
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">${plant.waterEfficiency}</span></td>
                        <td class="px-4 py-2"><span class="px-2 py-1 rounded ${
                          plant.totalScore >= 0.7
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">${plant.totalScore}</span></td>
                    `;

            // Make the entire row clickable to show plant info
            row.addEventListener("click", () => {
                const plantDialog = document.getElementById("plantDialog");
                const plantsList = document.getElementById("plantsList");
                
                // Create and show detailed plant info
                plantsList.innerHTML = `
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">${plant.name}</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p><span class="font-medium">Latin Name:</span> ${plant.latinName}</p>
                                <p><span class="font-medium">Growth Climate:</span> ${plant.growthClimate}</p>
                                <p><span class="font-medium">Watering Needs:</span> ${plant.wateringNeeds}</p>
                                <p><span class="font-medium">Time to Harvest:</span> ${plant.timeToConsumable} days</p>
                            </div>
                            <div>
                                <p><span class="font-medium">Weight when Grown:</span> ${plant.weightWhenFullGrown} kg</p>
                                <p><span class="font-medium">Calories:</span> ${plant.kcalPer100g} kcal/100g</p>
                                <p><span class="font-medium">Protein:</span> ${plant.proteinsPer100g}g/100g</p>
                            </div>
                        </div>
                        <button class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Plant</button>
                    </div>
                `;

                // Add click handler to the new plant button
                plantsList.querySelector("button").addEventListener("click", () => {
                    tile.plant = plant;
                    tile.terrain = "tree";
                    mapView.updateTiles([tile]);
                    plantDialog.classList.add("hidden");
                });
            });

            tableBody.appendChild(row);
          });
        })
        .catch((error) => {
          console.error("Error fetching plants:", error);
          loadingPlants.classList.add("hidden");
          plantsList.innerHTML = `<p class="text-red-500">Error loading plants: ${error.message}</p>`;
        });
    } else {
      // If no location, just update the terrain as before
      console.log("no location");
      tile.terrain = "plains";
    }

    mapView.updateTiles([tile]);
  };

  return mapView;
}

/**
 * @param fog whether there should be fog on this tile making it appear darker
 * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
 * @param range number of tiles around the given tile that should be updated
 * @param tile tile around which fog should be updated
 */
function setFogAround(
  mapView: MapView,
  tile: TileData,
  range: number,
  fog: boolean,
  clouds: boolean
) {
  const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range);

  const updated = tiles.map((t) => {
    t.fog = fog;
    t.clouds = clouds;
    return t;
  });

  mapView.updateTiles(updated);
}
