export class Simulator {
    currentPopulation: number = 0;
    currentTime: number = new Date().getTime() + 86400000;
    lockedLocations: string[] = ["Victory Mansions", "Ministry of Truth",
        "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
        "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
        "Prole District"];

    start(){
        const interval = setInterval(()=>{
            this.nextStep();
        }, 3600);
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