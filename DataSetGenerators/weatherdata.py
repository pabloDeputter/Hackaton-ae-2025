import numpy as np
import pandas as pd
#import matplotlib.pyplot as plt

# INFO #
# create weather data for a year (1/1/2023 to 31/12/2023)
# 

# Parameters for dataset generation
start_unix = 1672527600  # Start of the year (2023-01-01 00:00:00 UTC)
end_unix = 1704063599    # End of the year (2023-12-31 23:59:59 UTC)
num_entries = 1000       # Number of data points

# Generate random UNIXTimestamps within the range
timestamps = np.random.uniform(start_unix, end_unix, num_entries).astype(int)

# Convert UNIXTimestamps to day of year and hour for pattern generation
day_of_year = np.array([(ts - 1672527600) // 86400 % 365 for ts in timestamps])
hour_of_day = np.array([(ts // 3600) % 24 for ts in timestamps])

# Seasonal temperature pattern for Madrid (sinusoidal approximation)
temperature_seasonal = 15 + 10 * np.sin(2 * np.pi * day_of_year / 365 - np.pi / 2)

# Daily temperature fluctuations
temperature_daily = 5 * np.sin(2 * np.pi * hour_of_day / 24 - np.pi / 4)

# Combine seasonal and daily patterns with noise
air_temperature = temperature_seasonal + temperature_daily + np.random.normal(0, 2, num_entries)

# Air pressure with slight daily fluctuations
air_pressure = 1015 + 5 * np.sin(2 * np.pi * hour_of_day / 24) + np.random.normal(0, 2, num_entries)

# Wind speed is higher during the day and lower at night
wind_speed = np.where(hour_of_day < 6, 
                      np.random.uniform(0, 15, num_entries), 
                      np.random.uniform(10, 40, num_entries))

# Wind direction with gradual changes
wind_direction = (180 + 20 * np.sin(2 * np.pi * day_of_year / 30) + 
                  np.random.normal(0, 10, num_entries)) % 360

# Humidity inversely correlated with temperature
humidity = 90 - 0.5 * air_temperature + np.random.normal(0, 5, num_entries)

# Cloud coverage, more common in cooler months
cloud_coverage = np.where((day_of_year < 60) | (day_of_year > 300),  # Winter
                          np.random.uniform(50, 100, num_entries),  # High clouds
                          np.random.uniform(0, 50, num_entries))   # Low clouds in summer

# Precipitation more likely with higher cloud coverage
precipitation = np.where(cloud_coverage > 70, np.random.uniform(0, 10, num_entries), 0)

# Create DataFrame
weather_data = pd.DataFrame({
    "UNIXTimestamp": timestamps,
    "AirTemperatureCelsius": air_temperature,
    "Air Pressure (hPa)": air_pressure,
    "Wind Speed (km/h)": wind_speed,
    "Wind Direction (°)": wind_direction,
    "Humidity (%)": humidity,
    "Cloud Coverage (%)": cloud_coverage,
    "Precipitation (mm)": precipitation,
})

# Sort by UNIXTimestamp
weather_data = weather_data.sort_values("UNIXTimestamp").reset_index(drop=True)

# Save to CSV
weather_data.to_csv("madrid_weather_data.csv", index=False)

print("Weather data resembling Madrid generated and saved to 'madrid_weather_data.csv'.")


# reading the database
data = pd.read_csv("madrid_weather_data.csv")
 
# Scatter plot with day against temp
#plt.scatter(data['UNIXTimestamp'], data['AirTemperatureCelsius'])
 
# Adding Title to the Plot
#plt.title("Scatter Plot")
 
# Setting the X and Y labels
#plt.xlabel('UNIXTimestamp')
#plt.ylabel('AirTemperatureCelsius')
 
#plt.show()