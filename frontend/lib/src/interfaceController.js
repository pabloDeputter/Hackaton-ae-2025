define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loadTileStats(tile) {
        document.getElementById("currentTile").innerHTML = "Tile data " + tile.r + " " + tile.q;
    }
    exports.loadTileStats = loadTileStats;
});
//# sourceMappingURL=interfaceController.js.map