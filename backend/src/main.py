from typing import Union
import pandas as pd
from fastapi import FastAPI, HTTPException

from DataSetGenerators.Planter import *
from DataSetGenerators.Weather import WeatherDatasetGenerator
from backend.src.DataSetGenerators.persons import PopulationManager
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

PLANTS_DF = pd.read_csv('data/dataset_edible_plants_processed.csv')
# With index as plant name
COMPATIBILITY_MATRIX = pd.read_csv('data/plants_weather_compatibilities.csv', index_col=0)


weather = WeatherDatasetGenerator()
manager = PopulationManager()
food_data = pd.read_csv('..data/food.csv')


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
def get_plants(location: str, limit: int = 50, q: Union[str, None] = None):
    if location not in LOCATION_TO_CLIMATE:
        raise HTTPException(
            status_code=400, detail=f"Invalid location: {location}")

    if limit < 1:
        raise HTTPException(
            status_code=400, detail="Limit must be greater than 0")

    climate_type = LOCATION_TO_CLIMATE[location]

    # Create a scoring dataframe
    plant_scores = pd.DataFrame({
        'Name': PLANTS_DF['Name'],
        'Climate_Score': [COMPATIBILITY_MATRIX[climate_type][name] for name in PLANTS_DF['Name']],
        'Growth_Speed': 100 / PLANTS_DF['Time to Consumable (days)'],
        'Nutrition_Score': PLANTS_DF['Kcal per 100g'] * 0.7 + PLANTS_DF['Proteins per 100g (g)'] * 3,
        'Water_Efficiency': 2 - PLANTS_DF['Watering Needs']
    })
    
    # Normalize all scores to 0-1 range
    for column in ['Climate_Score', 'Growth_Speed', 'Nutrition_Score', 'Water_Efficiency']:
        if plant_scores[column].max() > plant_scores[column].min():
            plant_scores[column] = (plant_scores[column] - plant_scores[column].min()) / (plant_scores[column].max() - plant_scores[column].min())
        else:
            plant_scores[column] = 1.0
    
    # Calculate total score
    plant_scores['Total_Score'] = (
        plant_scores['Climate_Score'] * 2.0 +
        plant_scores['Growth_Speed'] * 1.5 +
        plant_scores['Nutrition_Score'] * 1.0 +
        plant_scores['Water_Efficiency'] * 1.5
    )

    # Normalize scores to 0 - 1 range
    if plant_scores['Total_Score'].max() > plant_scores['Total_Score'].min():
        plant_scores['Total_Score'] = (plant_scores['Total_Score'] - plant_scores['Total_Score'].min()) / (plant_scores['Total_Score'].max() - plant_scores['Total_Score'].min())
    else:
        plant_scores['Total_Score'] = 1
    
    # Sort and return top N plants based on 75% of limit
    top_plants = plant_scores.sort_values('Total_Score', ascending=False).head(int(limit * 0.76))

    # Add random plants that ARE NOT YET in the top plants
    random_plants = plant_scores[~plant_scores['Name'].isin(top_plants['Name'])].sample(n=int(limit * 0.25))
    top_plants = pd.concat([top_plants, random_plants])
    results = pd.merge(top_plants, PLANTS_DF, on='Name', how='inner')
    top_plants = top_plants.sort_values('Total_Score', ascending=False).head(limit)
    
    # Return in JSON format
    return results.to_dict(orient='records')


@app.post("/consume_food")
def consume_food(food: str):
    # get kcal from food name
    kcal = food_data.loc[food_data['food'] == food, 'kcal'].values[0]
    manager.consume_food(kcal)
    return {}
