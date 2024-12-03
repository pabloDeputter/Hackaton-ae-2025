import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Fictional location names inspired by 1984
locations = [
    "Airstrip One", "Victory Mansions", "Ministry of Truth",
    "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
    "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
    "Prole District"
]

# Köppen-Geiger classifications
koppen_geiger = ["Af", "Am", "Aw", "Cfb", "Cfa", "Csb", "Csc", "Dfb", "Dfc", "ET"]
location_koppen = dict(zip(locations, koppen_geiger))

# Generate daily timestamps from start to end date
start_date = datetime.utcfromtimestamp(1672527600)  # 2023-01-01
end_date = datetime.utcfromtimestamp(1704063599)    # 2024-12-31
date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

# Function to generate weather data with dependencies and extremes
def generate_weather(koppen, day_of_year):
    # Normalize day of the year for a sine wave (0 to 1)
    seasonal_factor = np.sin(2 * np.pi * day_of_year / 365)
    
    if koppen in ["Af", "Am", "Aw"]:  # Tropical
        temp_base = 28  # Average tropical temperature
        temp_variation = 5 * seasonal_factor  # More extremes
        temp = temp_base + temp_variation + np.random.uniform(-5, 5)  # Random fluctuation
        
        cloud_cover = np.random.uniform(50, 100)  # Higher average cloud cover
        precipitation = np.random.uniform(0, cloud_cover / 10)  # Correlated to cloud cover
        humidity = 70 + (cloud_cover / 3)  # Correlation: more clouds => higher humidity
    elif koppen in ["Cfb", "Cfa", "Csb", "Csc"]:  # Temperate
        temp_base = 10
        temp_variation = 15 * seasonal_factor  # More extreme seasonal change
        temp = temp_base + temp_variation + np.random.uniform(-10, 10)
        
        cloud_cover = np.random.uniform(20, 80)
        precipitation = np.random.uniform(0, cloud_cover / 8)
        humidity = 60 + (cloud_cover / 4)
    elif koppen in ["Dfb", "Dfc", "ET"]:  # Cold
        temp_base = -10
        temp_variation = 20 * seasonal_factor
        temp = temp_base + temp_variation + np.random.uniform(-15, 10)
        
        cloud_cover = np.random.uniform(10, 70)
        precipitation = np.random.uniform(0, cloud_cover / 12)
        humidity = 40 + (cloud_cover / 5)
    
    # Other variables with minor or no dependency
    pressure = np.random.uniform(1000, 1030) - (temp / 20)  # Colder temps => higher pressure
    wind_speed = np.random.uniform(5, 25)
    wind_dir = np.random.uniform(0, 360)
    
    return temp, pressure, wind_speed, wind_dir, humidity, cloud_cover, precipitation

# Generate the dataset
data = []

for location in locations:
    koppen = location_koppen[location]
    for date in date_range:
        day_of_year = date.timetuple().tm_yday
        temp, pressure, wind_speed, wind_dir, humidity, cloud_cover, precipitation = generate_weather(koppen, day_of_year)
        data.append([int(date.timestamp()), location, koppen, temp, pressure, wind_speed, wind_dir, humidity, cloud_cover, precipitation])

# Create a DataFrame
columns = [
    "UNIXTimestamp", "Location", "LocationKoppenGeigerClassification",
    "AirTemperatureCelsius", "AirPressure_hPa", "WindSpeed_kmh",
    "WindDirection_deg", "Humidity_percent", "CloudCoverage_percent", "Precipitation_mm"
]
df = pd.DataFrame(data, columns=columns)

# Save to CSV
df.to_csv("dataset_weather.csv", index=False)

# Confirm success
print(f"Dataset with {len(df)} rows saved to 'dataset_weather.csv'.")
