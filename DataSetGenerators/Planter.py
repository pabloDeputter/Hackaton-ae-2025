import pandas as pd
import numpy as np
import random

# Custom list of plant names
plant_names = [
    "Apple", "Banana", "Mango", "Orange", "Peach", "Pear", "Papaya", "Pineapple", "Watermelon", "Cucumber", 
    "Tomato", "Avocado", "Spinach", "Kale", "Lettuce", "Swiss Chard", "Beet Greens", "Radish", "Carrot", 
    "Broccoli", "Cauliflower", "Cabbage", "Brussels Sprouts", "Zucchini", "Squash", "Pumpkin", "Sweet Potato", 
    "Potato", "Corn", "Rice", "Wheat", "Barley", "Oats", "Quinoa", "Lentils", "Chickpeas", "Peas", "Beans", 
    "Soybeans", "Almond", "Walnut", "Pecan", "Hazelnut", "Chestnut", "Sunflower Seeds", "Sesame Seeds", "Flax Seeds", 
    "Chia Seeds", "Basil", "Mint", "Parsley", "Cilantro", "Thyme", "Rosemary", "Sage", "Dill", "Tarragon", "Oregano", 
    "Lavender", "Lemon Balm", "Fennel", "Celery", "Bell Pepper", "Chili Pepper", "Okra", "Eggplant", "Artichoke", 
    "Asparagus", "Bok Choy", "Mustard Greens", "Collard Greens", "Arugula", "Endive", "Escarole", "Green Onion", 
    "Garlic", "Leek", "Shallot", "Onion", "Ginger", "Turmeric", "Horseradish", "Daikon", "Turnip", "Rutabaga", "Yam", 
    "Parsnip", "Kohlrabi", "Jerusalem Artichoke", "Malabar Spinach", "Purslane", "Dandelion Greens", "Nasturtium", 
    "Sorrel", "Rhubarb", "Gooseberry", "Currant", "Cranberry", "Blueberry", "Blackberry", "Raspberry", "Strawberry", 
    "Mulberry", "Fig", "Kiwi", "Guava", "Lychee", "Durian", "Rambutan", "Passion Fruit", "Jackfruit", "Breadfruit", 
    "Starfruit", "Dragonfruit", "Tamarind", "Pomegranate", "Coconut", "Cashew", "Pistachio", "Macadamia Nut", 
    "Brazil Nut", "Betel Nut", "Carob", "Cocoa Bean", "Coffee Bean", "Vanilla", "Dates", "Olives", "Caper", "Figs", 
    "Chestnut", "Lotus Root", "Arrowroot", "Taro", "Cassava", "Seaweed", "Nori", "Wakame", "Kombu", "Alfalfa Sprouts", 
    "Mung Bean Sprouts", "Chickweed", "Amaranth", "Quail Grass", "Agave", "Aloe Vera", "Bamboo Shoots", "Burdock Root", 
    "Cattail", "Lamb's Quarters", "Plantain", "Prickly Pear Cactus", "Watercress", "Hibiscus", "Rose Hips", "Elderberry", 
    "Mulberry", "Jujube", "Ackee", "Breadnut", "Ackee", "Acerola", "Sapote", "Loquat", "Santol", "Longan", "Mangosteen", 
    "Salak", "Miracle Fruit", "Wolfberry", "Aronia", "Medlar", "Tamarillo", "Pepino", "Chayote", "Bitter Melon", 
    "Winter Melon", "Snake Gourd", "Sponge Gourd", "Teff", "Einkorn", "Spelt", "Sorghum", "Millet", "Rye", "Triticale", 
    "Kamut", "Buckwheat", "Wild Rice", "Fonio", "Farro", "Adzuki Beans", "Black Beans", "Kidney Beans", "Navy Beans", 
    "Pinto Beans", "Cranberry Beans", "Lupin Beans", "Black-Eyed Peas", "Lentils", "Split Peas", "Chickpea", 
    "Cannellini Bean", "Fava Bean", "Lima Bean", "Mung Bean", "Soybean", "Winged Bean", "Hyacinth Bean", "Peanuts", 
    "Pea Shoots", "Wasabi", "Sea Kale", "Lovage", "Tarragon", "Lemon Thyme", "Wild Garlic", "Ramsons", "Stinging Nettle", 
    "Pokeweed", "Marshmallow", "Sassafras", "Hops", "Sweet Violet", "Blue Cornflower", "Borage", "Calendula", "Chamomile", 
    "Carnation", "Chrysanthemum", "Lavender", "Marigold", "Nasturtium", "Pansy", "Rose", "Safflower", "Sunflower", "Zucchini Blossoms"
]

# Helper functions for random generation
def random_climate():
    return np.random.choice(["Tropical", "Temperate", "Arid", "Mediterranean", "Polar"])

def random_watering():
    return np.random.choice(["Low", "Moderate", "High"])

def random_time_to_consumable():
    return np.random.randint(30, 365)  # days

def random_weight():
    return round(np.random.uniform(0.1, 5.0), 2)  # kg

def random_kcal():
    return round(np.random.uniform(10, 400), 1)  # kcal per 100g

def random_protein():
    return round(np.random.uniform(0.5, 10.0), 1)  # protein per 100g

# Generate fake Latin name
def generate_latin_name(common_name):
    latin_base = {
        "Apple": "Malum",
        "Banana": "Musa",
        "Mango": "Mangifera",
        "Orange": "Citrus",
        "Peach": "Prunus",
        "Pear": "Pyrus",
        "Papaya": "Carica",
        "Pineapple": "Ananas",
        "Watermelon": "Citrullus",
        "Cucumber": "Cucumis",
        # Add more mappings as needed
    }

    # Default case for plants not in the dictionary
    latin_first = latin_base.get(common_name, common_name.capitalize())
    latin_second = random.choice(["sapiens", "fixa", "vulgaris", "indica", "genuina", "latifolia", "minor", "major"])

    return f"{latin_first} {latin_second}"



# Generate data
num_records = len(plant_names)  # use the length of the provided list
data = {
    "Name": plant_names,
    "Latin Name": [generate_latin_name(name) for name in plant_names],
    "Ideal growth Climate": [random_climate() for _ in range(num_records)],
    "Watering Needs": [random_watering() for _ in range(num_records)],
    "Time to Consumable (days)": [random_time_to_consumable() for _ in range(num_records)],
    "Weight when Full Grown (kg)": [random_weight() for _ in range(num_records)],
    "Kcal per 100g": [random_kcal() for _ in range(num_records)],
    "Proteins per 100g (g)": [random_protein() for _ in range(num_records)]
}

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("dataset_edible_plants.csv", index=False)

print("Dataset generated and saved as 'dataset_edible_plants.csv'.")
