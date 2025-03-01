define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulator = /** @class */ (function () {
        function Simulator() {
            this.currentPopulation = 0;
            this.currentTime = new Date().getTime() + 86400000;
            this.lockedLocations = ["Victory Mansions", "Ministry of Truth",
                "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
                "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
                "Prole District"];
        }
        Simulator.prototype.start = function () {
            var _this = this;
            var interval = setInterval(function () {
                _this.nextStep();
            }, 1000);
        };
        Simulator.prototype.nextStep = function () {
            this.currentTime += 3600;
            this.currentPopulation = Math.random();
            this.updateInterface();
        };
        Simulator.prototype.updateInterface = function () {
            document.getElementById("clock").innerHTML = new Date(this.currentTime).toISOString();
        };
        return Simulator;
    }());
    exports.Simulator = Simulator;
});
//# sourceMappingURL=Simulator.js.map