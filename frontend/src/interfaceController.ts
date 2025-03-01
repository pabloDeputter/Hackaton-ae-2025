import {TileData} from "./interfaces";

export function loadTileStats(tile:TileData){
    document.getElementById("currentTile").innerHTML = "Tile data " + tile.r + " " + tile.q;
}