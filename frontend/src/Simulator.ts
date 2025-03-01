import MapView from "./MapView";

export class Simulator {
    currentPopulation: number = 0;
    currentTime: number = new Date().getTime();
    mapView: MapView;
    lockedLocations: string[] = ["Victory Mansions", "Ministry of Truth",
        "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
        "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
        "Prole District"];

    constructor(mapview:MapView) {
        this.mapView = mapview;
    }


    start(){
        let tiles = this.mapView.getTileGrid();
        tiles.forEachQR((q,r, tile) => {
            tile.fog = true;
        })

        this.mapView.updateTiles(tiles.toArray());

        const interval = setInterval(()=>{
            this.nextStep();
        }, 1000);
    }

    nextStep(){
        this.currentTime += 3600;
        this.currentPopulation = Math.random();
        this.updateInterface();
    }

    updateInterface(){
        document.getElementById("clock").innerHTML = new Date(this.currentTime).toISOString()
    }
}