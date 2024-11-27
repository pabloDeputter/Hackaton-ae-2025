import pandas as pd
import random

# List of fictional diseases
disease_list = [
    "Snorglesniff", "Coughadoodle", "Fumbleitis", "Giggleflux", "Sneezequake", "Toe Tangle", 
    "Elbow Wiggle Syndrome", "Brain Freeze Disorder", "Blabber Mouth", "Wiggleworm Fever", 
    "Itchy Nose Syndrome", "Smirk Spasm", "Jelly Legs", "Pickle Pox", "Hiccuphobia", 
    "Belly Button Bounce", "Eye Twitch Fever", "Snore-a-palooza", "Stumblebum Syndrome", 
    "Gigglicious", "Chewbug Syndrome", "Earwax Overflow", "Laughter Laryngitis", "Hair Frizzitis", 
    "Lip Quiver Flu", "Kneecap Knots", "Wigglewig Fever", "Butterfingers Disorder", 
    "Dandruff Avalanche", "Freckle Sprout", "Mustache Mishap", "Knuckle Knock Fever", 
    "Toe Jamitis", "Chatterbox Syndrome", "Guffaw Glitch", "Sneeze Surplus", "Wink Warp", 
    "Finger Fidget Flu", "Loopy Tongue", "Shiver Shakes", "Silly Spasm", "Sniffle Storm", 
    "Belly Jiggles", "Ear Wobble Fever", "Tickleitis", "Nose Wiggle Syndrome", "Flip Flop Flu", 
    "Grin-a-thon", "Whistle Whimsy", "Toe Wiggle Flu", "Guffaw Gallop", "Yawn Yodeling", 
    "Tongue Twister Fever", "Wiggle Waggle", "Skipping Sneeze", "Dizzy Doodles", "Fluff Flu", 
    "Chuckle Chills", "Hiccup Hurricane", "Lollipop Laryngitis", "Hair Twiddle Fever", 
    "Knuckle Twitch", "Thumb Sneeze Syndrome", "Giggly Goo", "Fuzzbrain", "Elbow Elasticitis", 
    "Snore Snaggle", "Pickleitis", "Groan Giggles", "Twinkle Toe Flu", "Smirk Swirl", 
    "Whisker Wobble", "Ear Flap Fever", "Jabberjaw Jitters", "Tiptoe Tingle", "Belly Bongo Syndrome", 
    "Zany Zippers", "Nose Tickle Tornado", "Wiggle Wobble Flu", "Thumb Twiddle Trouble", 
    "Snore Tsunami", "Noodle Knees", "Mirth Meltdown", "Chortle Chills", "Sneeze Splat", 
    "Elbow Echo Fever", "Toe Tango Syndrome", "Chuckleitis", "Nose Twitch Tizzy", 
    "Wiggle Wag Syndrome", "Belly Button Bongo", "Sneezequake Shuffle", "Fuzzy Flu", 
    "Gurgle Giggles", "Blabberflu", "Guffaw Gush", "Noodle Limb Disorder", "Freckle Freestyle", 
    "Chuckle Flux", "Cackle Chills", "Nose Nugget Fever", "Wiggle Wobble Woes", "Sniffle Snaggle", 
    "Knee Jerk Jamboree", "Mirth Madness", "Goosebump Gallop", "Laughter Leakage", 
    "Freckle Fiasco", "Snore Snag", "Eye Pop Syndrome", "Giggle Twitch", "Hairy Hiccups", 
    "Whisker Quiver", "Wink Whiz", "Belly Button Boogie", "Snicker Sprain", "Wiggle Wob Syndrome", 
    "Cackle Collapse", "Yawn Yodel Flu", "Belly Button Jiggles", "Twitch Tummy Trouble", 
    "Silly Twitch Flu", "Nose Gobble Flu", "Smirk Shakes", "Jabberjaw Jive", "Fuzzy Face Flu", 
    "Toe Tangle Tizzy", "Chucklequake", "Tickle Tantrum", "Belly Belly Boogie", "Wink Warp Syndrome", 
    "Silly Stagger", "Nose Goblin Flu", "Belly Bumperitis", "Hiccup Havoc", "Wiggle Giggle Flu", 
    "Toe Tangle Trauma", "Elbow Elasticity Syndrome", "Guffaw Glimmer", "Belly Jiggle Jitters", 
    "Tickleitis Tango", "Freckle Fumble", "Elbow Snaggle", "Hair Sprout Fever", "Toe Wobble Flu", 
    "Gurgle Giggle Glitch", "Sneeze Snap", "Yawn Yodelitis", "Snore Wiggle Fever"
]

# Define possible values for each attribute
fever_options = ["yes", "no"]
heart_rate_options = ["slower", "normal", "faster"]
breath_rate_options = ["slower", "normal", "faster"]
blood_pressure_options = ["low", "normal", "high"]
symptom_options = ["fatigue", "sleepy", "shortness of breath", "diarrhea", "coughing", "muscle aches"]
type_options = ["Inherited", "Congenital", "Degenerative", "Nutritional deficiency", "Endocrine", "Neoplastic", "Idiopathic"]
duration_options = ["Acute", "Chronic"]
infectious_options = ["yes", "no"]

# Function to generate random symptoms
def random_symptoms():
    return ", ".join(random.sample(symptom_options, random.randint(1, len(symptom_options))))

# Generate the dataset
def generate_dataset(diseases):
    data = []
    for disease in diseases:
        record = {
            "Disease": disease,
            "Fever": random.choice(fever_options),
            "Heart Rate": random.choice(heart_rate_options),
            "Breath Rate": random.choice(breath_rate_options),
            "Blood Pressure": random.choice(blood_pressure_options),
            "Symptoms": random_symptoms(),
            "Type": random.choice(type_options),
            "Incubation Time (days)": random.randint(1, 14),
            "Period of Illness (days)": random.randint(1, 21),
            "Duration": random.choice(duration_options),
            "Infectious": random.choice(infectious_options)
        }
        data.append(record)
    return pd.DataFrame(data)

# Generate the dataset for all diseases
dataset = generate_dataset(disease_list)

# Save the dataset to a CSV file
dataset.to_csv("dataset_disease.csv", index=False)

# Display the first few rows
print("Dataset generated and saved as 'dataset_disease.csv'")
