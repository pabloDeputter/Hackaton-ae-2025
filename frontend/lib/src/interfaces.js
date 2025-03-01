define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GrowthStage;
    (function (GrowthStage) {
        GrowthStage["Seed"] = "Seed";
        GrowthStage["Sprout"] = "Sprout";
        GrowthStage["Young"] = "Young";
        GrowthStage["Mature"] = "Mature";
        GrowthStage["Harvestable"] = "Harvestable";
        GrowthStage["Dead"] = "Dead";
    })(GrowthStage = exports.GrowthStage || (exports.GrowthStage = {}));
    function isLand(height) {
        return height >= 0.0 && height < 0.75;
    }
    exports.isLand = isLand;
    function isWater(height) {
        return height < 0.0;
    }
    exports.isWater = isWater;
    function isHill(height) {
        return height >= 0.375 && height < 0.75;
    }
    exports.isHill = isHill;
    function isMountain(height) {
        return height >= 0.75;
    }
    exports.isMountain = isMountain;
});
//# sourceMappingURL=interfaces.js.map