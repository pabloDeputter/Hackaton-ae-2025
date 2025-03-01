import pandas as pd

from DataSetGenerators.Weather import WeatherDatasetGenerator

generator = WeatherDatasetGenerator()
generator.generate_dataset()
df = generator.get_dataset()
print(df.head())  # Display first few rows