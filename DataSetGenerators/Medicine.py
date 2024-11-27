import random
import pandas as pd

# Generate a fictional Latin-Japanese sounding name
def generate_name(existing_names):
    prefixes = ["Med", "Neo", "Ther", "Vita", "Pharma"]
    mid = ["ondi","fentra","domo","ilex","umio","cris","hul","vri", "clam","nix", "yam","tyl"]
    suffixes = ["saki", "mono", "yaku", "zine", "trol", "nex"]
    
    while True:
        name = random.choice(prefixes) + random.choice(mid) + random.choice(suffixes)
        if name not in existing_names:
            existing_names.add(name)  # Add the name to the set of existing names
            return name

# Possible values for attributes
types = ["antipyretics", "painkiller", "tranquilizer", "stimulant", "antiseptic", "antibiotic", "statin", "stabilizer"]
treatments = ["Inherited", "Congenital", "Degenerative", "Nutritional deficiency", "Endocrine", "Neoplastic", "Idiopathic"]

# Generate random dataset
def generate_medicine_data(num_records):
    data = []
    existing_names = set()  # Track unique names
    for _ in range(num_records):
        name = generate_name(existing_names)
        med_type = random.choice(types)
        days_of_treatment = random.randint(1, 21)
        dosage = round(random.uniform(0.5, 10), 1)
        treatment = random.choice(treatments)
        data.append({"Name": name, "Type": med_type, "Days of Treatment": days_of_treatment, "Dosage": dosage, "Treatment": treatment})
    return data

# Generate a dataset of 100 fictional medicines
num_records = 100
medicine_data = generate_medicine_data(num_records)

# Convert to a DataFrame for easier analysis/export
df = pd.DataFrame(medicine_data)

# Save to CSV file
output_file = "dataset_medicines.csv"
df.to_csv(output_file, index=False)
print(f"Dataset generated and saved to {output_file}")
