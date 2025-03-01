/**
 * Height between -1.0 and 1.0:
 * [-1.00,-0.25) == deep water
 * [-0.25,+0.00) == shallow water
 * [+0.00,+0.25) == flat land
 * [+0.25,+0.75) == hills
 * [+0.75,+1.00] == mountains
 */
export type Height = number;

export enum GrowthStage {
  Seed = "Seed",
  Sprout = "Sprout",
  Young = "Young",
  Mature = "Mature",
  Harvestable = "Harvestable",
}

export interface Plant {
  name: string;
  totalScore: number;
  growthClimate: string;
  wateringNeeds: string;
  timeToConsumable: number; // in days
  weightWhenFullGrown: number; // in kg
  kcalPer100g: number;
  proteinsPer100g: number;
  growthStage: GrowthStage; // Current stage of the plant
  daysSincePlanted: number; // Track days since it was planted
  climateScore: number;
  growthSpeed: number;
  nutritionScore: number;
  waterEfficiency: number;
}

export interface TileData {
  q: number;
  r: number;
  height: Height;
  fog: boolean;
  clouds: boolean;
  terrain: string;
  rivers?: { riverIndex: number; riverTileIndex: number }[];
  treeIndex?: number; // index of tree texture, optional
  location?: string; // Add location tag for 10 locations
  plant?: Plant; // Add plant data
  locked: boolean;
}

export function isLand(height: Height) {
  return height >= 0.0 && height < 0.75;
}

export function isWater(height: Height) {
  return height < 0.0;
}

export function isHill(height: Height) {
  return height >= 0.375 && height < 0.75;
}

export function isMountain(height: Height) {
  return height >= 0.75;
}

export interface TextureAtlas {
  textures: {
    [name: string]: Cell;
  };
  image: string;
  width: number;
  height: number;
  cellSize: number;
  cellSpacing: number;
}

export interface Cell {
  cellX: number;
  cellY: number;
}

export interface QR {
  q: number;
  r: number;
}

export interface TileDataSource {
  getTile(q: number, r: number): TileData;
  updateTiles(tiles: TileData[]): void;
}
