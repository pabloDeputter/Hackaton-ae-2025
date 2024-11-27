import csv
import json
from typing import Any, Dict

def infer_type(value: str) -> str:
    """
    Infer the JSON schema type of a value.
    """
    try:
        int(value)
        return "integer"
    except ValueError:
        pass
    try:
        float(value)
        return "number"
    except ValueError:
        pass
    if value.lower() in ["true", "false"]:
        return "boolean"
    return "string"

def generate_json_schema(csv_file: str) -> Dict[str, Any]:
    """
    Generate a JSON schema from a CSV file.
    """
    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        field_types = {}

        # Read rows and infer types
        for row in reader:
            for field, value in row.items():
                if field not in field_types:
                    field_types[field] = set()
                field_types[field].add(infer_type(value))

        # Finalize field types
        properties = {}
        for field, types in field_types.items():
            if len(types) > 1:
                json_type = "string"  # Default to string if multiple types are found
            else:
                json_type = next(iter(types))
            properties[field] = {"type": json_type}

        schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": properties,
            "required": list(field_types.keys()),  # Assuming all fields are required
        }

    return schema

def save_json_schema(schema: Dict[str, Any], output_file: str):
    """
    Save the JSON schema to a file.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(schema, file, indent=4)

# GENERATING

inputfiles = ["dataset_edible_plants.csv","dataset_disease.csv","dataset_medicines.csv","dataset_weather.csv"]

#csv_input = 'edible_plants_dataset.csv'  # Replace with your CSV file path
#json_output = 'edible_plants.json'  # Replace with desired JSON schema file path

for file in inputfiles:
    schema = generate_json_schema(file)
    print(file)
    save_json_schema(schema, "schema_"+file)
    print(f"JSON schema saved to {file}"+".json")
