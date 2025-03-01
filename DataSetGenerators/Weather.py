import numpy as np
import pandas as pd
from datetime import datetime, timedelta


class WeatherDatasetGenerator:
    def __init__(self, start_timestamp=1672527600, end_timestamp=1704063599):
        # Fictional location names inspired by 1984
        self.locations = [
            "Airstrip One", "Victory Mansions", "Ministry of Truth",
            "Ministry of Love", "Ministry of Peace", "Ministry of Plenty",
            "Chestnut Tree Café", "Golden Country", "Outer Party Sector",
            "Prole District"
        ]

        # Köppen-Geiger classifications
        koppen_geiger = ["Af", "Am", "Aw", "Cfb", "Cfa", "Csb", "Csc", "Dfb", "Dfc", "ET"]
        self.location_koppen = dict(zip(self.locations, koppen_geiger))

        # Generate daily timestamps
        self.start_date = datetime.utcfromtimestamp(start_timestamp)
        self.end_date = datetime.utcfromtimestamp(end_timestamp)
        self.date_range = [self.start_date + timedelta(days=i) for i in range((self.end_date - self.start_date).days + 1)]

        # Placeholder for generated dataset
        self.data = None

    def generate_weather(self, koppen, day_of_year):
        """Generate weather data based on climate classification and seasonal effects."""
        seasonal_factor = np.sin(2 * np.pi * day_of_year / 365)

        if koppen in ["Af", "Am", "Aw"]:  # Tropical
            temp_base = 28
            temp_variation = 5 * seasonal_factor
            temp = temp_base + temp_variation + np.random.uniform(-5, 5)
            cloud_cover = np.random.uniform(50, 100)
            precipitation = np.random.uniform(0, cloud_cover / 10)
            humidity = 70 + (cloud_cover / 3)

        elif koppen in ["Cfb", "Cfa", "Csb", "Csc"]:  # Temperate
            temp_base = 10
            temp_variation = 15 * seasonal_factor
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

        # Other variables
        pressure = np.random.uniform(1000, 1030) - (temp / 20)
        wind_speed = np.random.uniform(5, 25)
        wind_dir = np.random.uniform(0, 360)

        return temp, pressure, wind_speed, wind_dir, humidity, cloud_cover, precipitation

    def generate_dataset(self):
        """Generate the complete weather dataset."""
        data = []

        for location in self.locations:
            koppen = self.location_koppen[location]
            for date in self.date_range:
                day_of_year = date.timetuple().tm_yday
                temp, pressure, wind_speed, wind_dir, humidity, cloud_cover, precipitation = self.generate_weather(
                    koppen, day_of_year
                )
                data.append([
                    int(date.timestamp()), location, koppen, temp, pressure, wind_speed, wind_dir, humidity,
                    cloud_cover, precipitation
                ])

        columns = [
            "UNIXTimestamp", "Location", "LocationKoppenGeigerClassification",
            "AirTemperatureCelsius", "AirPressure_hPa", "WindSpeed_kmh",
            "WindDirection_deg", "Humidity_percent", "CloudCoverage_percent", "Precipitation_mm"
        ]
        self.data = pd.DataFrame(data, columns=columns)

    def get_dataset(self):
        """Retrieve the generated dataset as a pandas DataFrame."""
        if self.data is None:
            raise ValueError("Dataset has not been generated yet. Call generate_dataset() first.")
        return self.data

    def save_to_csv(self, filename="dataset_weather.csv"):
        """Save the dataset to a CSV file."""
        if self.data is None:
            raise ValueError("Dataset has not been generated yet. Call generate_dataset() first.")
        self.data.to_csv(filename, index=False)
        print(f"Dataset with {len(self.data)} rows saved to '{filename}'.")


# Usage example:
# generator = WeatherDatasetGenerator()
# generator.generate_dataset()
# df = generator.get_dataset()
# print(df.head())  # Display first few rows
# generator.save_to_csv("weather_data.csv")
