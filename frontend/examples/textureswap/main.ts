import {initView} from "view"
import {initInput} from "input"
import {paramFloat, paramInt} from './util';
import MapView from "../../src/MapView";
import {Simulator} from "../../src/Simulator";

const mapSize = paramInt("size", 20)
const zoom = paramFloat("zoom", 50)

async function init() {
    const mapView = await initView(mapSize, zoom)
    initInput(mapView)

    // texture swap
    const containers = document.querySelectorAll("#textures div")
    console.log(containers)
    for (let i = 0; i < containers.length; i++) {
        const container = containers.item(i)
        const name = container.id

        container.addEventListener("dragenter", noop, false)
        container.addEventListener("dragexit", noop, false)
        container.addEventListener("dragover", noop, false)
        container.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault()
        }, false)
    }

    let simulator = new Simulator(mapView);
    simulator.start();
}


function noop(e: DragEvent) {
    e.preventDefault()
}

init()
