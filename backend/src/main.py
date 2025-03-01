from typing import Union

from fastapi import FastAPI, HTTPException
from .DataSetGenerators.Weather import WeatherDatasetGenerator
from .DataSetGenerators.Planter import *


app = FastAPI()

# Map locations to climate type (growth climate in plants)
LOCATION_TO_CLIMATE = {
    'Airstrip One': 'Tropical',
    'Victory Mansions': 'Tropical',
    'Ministry of Truth': 'Tropical',
    'Ministry of Love': 'Temperate',
    'Ministry of Peace': 'Temperate',
    'Ministry of Plenty': 'Mediterranean',
    'Chestnut Tree Café': 'Mediterranean',
    'Golden Country': 'Temperate',
    'Outer Party Sector': 'Temperate',
    'Prole District': 'Polar'
}

weather = WeatherDatasetGenerator()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/getWeather/{location}/{day}")
def get_weather(location: str, day: int, q: Union[str, None] = None):
    # todo change to make all days
    if day < 1 or day > 365:
        raise HTTPException(
            status_code=400, detail="Day must be between 1 and 365")
    if location not in weather.locations:
        raise HTTPException(
            status_code=400, detail=f"Invalid location: {location}")

    try:
        weather_data = weather.generate_weather(
            weather.location_koppen[location], day)
        return weather_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/getPlants/{location}")
def get_plants(location: str, q: Union[str, None] = None):
    return 0
