import {simplex2, perlin2, seed} from "./perlin"
import {Height, TileData, isLand, isWater, isMountain, isHill} from "./interfaces"
import {shuffle, qrRange} from "./util";
import Grid from './Grid';
import {Vector3, Scene} from "three";
import {randomPointInHexagonEx} from "./hexagon";
import {varying} from "../examples/textureswap/util";


const locations = [
    "Airstrip One", "Victory Mansions", "Ministry of Truth",
    "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
    "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
    "Prole District"
];

// Simple seedable random number generator
class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next() {
        // Implementing a simple linear congruential generator (LCG)
        this.seed = (this.seed * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (this.seed >>> 16) / 0xFFFF;
    }

    nextInt(min: number, max: number) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

export function assignLocationZones(grid: Grid<TileData>, seed: number) {
    const rng = new SeededRandom(seed);  // Create a deterministic RNG based on the seed
    const allTiles = seededShuffle(grid.toArray(), rng);  // Randomize order with seed
    const occupiedTiles: Record<string, boolean> = {};  // Use a plain object for occupied tracking

    const locationCount = locations.length;
    let assigned = 0;

    for (const centerTile of allTiles) {
        if (assigned >= locationCount) break;  // Stop when all locations are placed

        if (isTileOccupied(centerTile.q, centerTile.r, occupiedTiles, grid)) {
            continue;  // Skip if this tile or its neighbors are occupied
        }

        const location = locations[assigned];

        // Set the center tile and surrounding tiles (randomly expanding the area)
        expandLocationArea(centerTile, location, occupiedTiles, grid, rng);

        assigned++;
    }

    if (assigned < locationCount) {
        console.warn(`Only placed ${assigned} locations out of ${locationCount}. Not enough space.`);
    }
}

// Expands the location area with a random number of tiles
function expandLocationArea(centerTile: TileData, location: string, occupied: Record<string, boolean>, grid: Grid<TileData>, rng: SeededRandom) {
    // Create a random size for the location area (e.g., between 7 and 15 tiles)
    const areaSize = rng.nextInt(7, 22);  // Random size between 7 and 15 using the seeded RNG

    // Start with the center and its direct neighbors
    const toAssign: TileData[] = [centerTile];
    markTileOccupied(centerTile.q, centerTile.r, occupied);

    // Assign neighbors and expand the area randomly
    let tileIndex = 0;
    while (toAssign.length < areaSize && tileIndex < toAssign.length) {
        const currentTile = toAssign[tileIndex];
        const neighbors = grid.neighbors(currentTile.q, currentTile.r);

        // Shuffle neighbors to add a random selection of them using the seeded RNG
        seededShuffle(neighbors, rng).forEach(neighbor => {
            if (toAssign.length < areaSize) {
                toAssign.push(neighbor);
                markTileOccupied(neighbor.q, neighbor.r, occupied);
            }
        });

        tileIndex++;
    }

    // Now assign all the selected tiles the current location and terrain type
    toAssign.forEach(tile => {
        tile.location = location;
        tile.terrain = "plains";  // Adjust as necessary
        tile.locked = false;
    });
}

// Helper to check if a tile and its neighbors are occupied
function isTileOccupied(q: number, r: number, occupied: Record<string, boolean>, grid: Grid<TileData>): boolean {
    if (occupied[`${q},${r}`]) return true;

    const neighbors = grid.neighbors(q, r);
    for (const neighbor of neighbors) {
        if (occupied[`${neighbor.q},${neighbor.r}`]) {
            return true;  // One of the neighbors is already occupied
        }
    }

    return false;
}

// Helper to mark a tile as occupied (center + optional buffer)
function markTileOccupied(q: number, r: number, occupied: Record<string, boolean>) {
    occupied[`${q},${r}`] = true;

    // Optional buffer - mark adjacent tiles to avoid tight clustering
    const bufferOffsets = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, -1], [-1, 1]
    ];
    for (const [dq, dr] of bufferOffsets) {
        occupied[`${q + dq},${r + dr}`] = true;
    }
}

// Helper to shuffle an array using a seeded random number generator
function seededShuffle<T>(array: T[], rng: SeededRandom): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}




function randomHeight(q: number, r: number) {
    var noise1 = simplex2(q / 10, r / 10)
    var noise2 = perlin2(q / 5, r / 5)
    var noise3 = perlin2(q / 30, r / 30)
    var noise = noise1 + noise2 + noise3

    return noise / 3.0 * 2.0
}


const urlParams = new URLSearchParams(window.location.search);
const global_seed = parseInt(urlParams.get('seed'), 10);  // Get seed as an integer

/**
 * Generates are square map of the given size centered at (0,0).
 * @param size
 * @param heightAt
 * @param terrainAt
 */
export async function generateMap(size: number, tile: (q: number, r: number) => TileData): Promise<Grid<TileData>> {
    const grid = new Grid<TileData>(size, size).mapQR((q, r) => tile(q, r))
    assignLocationZones(grid, global_seed)
    const withRivers = generateRivers(grid)
    return withRivers
}

export async function generateIsland(size: number): Promise<Grid<TileData>> {
    let tile = (q: number, r: number): TileData => {
        return {
            clouds: false, fog: false, height: 0, q: q, r: r, terrain: "grass", locked: true
        }
    }


   const map = new Grid<TileData>(size,size);

    await seed(Date.now() + Math.random())
    return generateMap(size, (q, r) => tile(q, r))
}

export async function generateRandomMap(size: number, tile: (q: number, r: number, height: Height) => TileData): Promise<Grid<TileData>> {
    await seed(Date.now() + Math.random())
    return generateMap(size, (q, r) => tile(q, r, randomHeight(q, r)))
}

function generateRivers(grid: Grid<TileData>): Grid<TileData> {
    // find a few river spawn points, preferably in mountains
    const tiles = grid.toArray()
    const numRivers = Math.max(1, Math.round(Math.sqrt(grid.length) / 4)) 
    const spawns: TileData[] = shuffle(tiles.filter(t => isAccessibleMountain(t, grid))).slice(0, numRivers)

    // grow the river towards the water by following the height gradient
    const rivers = spawns.map(growRiver)

    // assign sequential indices to rivers and their tiles
    rivers.forEach((river, riverIndex) => {
        river.forEach((tile, riverTileIndex) => {
            if (riverTileIndex < river.length - 1) {
                tile.rivers = [{riverIndex, riverTileIndex}]
            }
        })
    })

    return grid

    function growRiver(spawn: TileData): TileData[] {
        const river = [spawn]

        let tile = spawn

        while (!isWater(tile.height) && river.length < 20) {
            const neighbors = sortByHeight(grid.neighbors(tile.q, tile.r)).filter(t => !contains(t, river))
            if (neighbors.length == 0) {
                console.info("Aborted river generation", river, tile)
                return river
            }

            const next = neighbors[Math.max(neighbors.length - 1, Math.floor(Math.random() * 1.2))]
            river.push(next)

            tile = next
        }

        return river
    }

    function sortByHeight(tiles: TileData[]): TileData[] {
        return tiles.sort((a, b) => b.height - a.height)
    }

    function contains(t: TileData, ts: TileData[]) {
        for (let other of ts) {
            if (other.q == t.q && other.r == t.r) {
                return true
            }
        }
        return false
    }
}

function isAccessibleMountain(tile: TileData, grid: Grid<TileData>) {
    let ns = grid.neighbors(tile.q, tile.r)
    let spring = isMountain(tile.height)
    return spring && ns.filter(t => isLand(t.height)).length > 3
}

/**
 * Indicates in which directions there is water from NE (North East) to NW (North West).
 */
export interface WaterAdjacency {
    NE: boolean;
    E: boolean;
    SE: boolean;
    SW: boolean;
    W: boolean;
    NW: boolean;
}

/**
 * Computes the water adjecency for the given tile.
 * @param grid grid with all tiles to be searched
 * @param tile tile to look at
 */
export function waterAdjacency(grid: Grid<TileData>, tile: TileData): WaterAdjacency {
    function isWaterTile(q: number, r: number) {
        const t = grid.get(q, r)
        if (!t) return false
        return isWater(t.height)
    }

    return {
        NE: isWaterTile(tile.q + 1, tile.r - 1),
        E: isWaterTile(tile.q + 1, tile.r),
        SE: isWaterTile(tile.q, tile.r + 1),
        SW: isWaterTile(tile.q - 1, tile.r + 1),
        W: isWaterTile(tile.q - 1, tile.r),
        NW: isWaterTile(tile.q, tile.r - 1)
    }
}

/**
 * Returns a random point on a hex tile considering adjacent water, i.e. avoiding points on the beach.
 * @param water water adjacency of the tile
 * @param scale coordinate scale
 * @returns {THREE.Vector3} local position
 */
export function randomPointOnCoastTile(water: WaterAdjacency, scale: number = 1.0): Vector3 {
    return randomPointInHexagonEx(scale, corner => {
        corner = (2 + (6 - corner)) % 6
        if (corner == 0 && water.NE) return 0.5
        if (corner == 1 && water.E) return 0.5
        if (corner == 2 && water.SE) return 0.5
        if (corner == 3 && water.SW) return 0.5
        if (corner == 4 && water.W) return 0.5
        if (corner == 5 && water.NW) return 0.5

        return 1
    })
}