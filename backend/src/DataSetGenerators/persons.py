import random


class Plant:
    def __init__(self, name, latin_name, growth_climate, watering_needs, time_to_consumable, weight_full_grown,
                 kcal_per_100g, protein_per_100g):
        self.name = name
        self.latin_name = latin_name
        self.growth_climate = growth_climate
        self.watering_needs = watering_needs
        self.time_to_consumable = time_to_consumable
        self.weight_full_grown = weight_full_grown
        self.kcal_per_100g = kcal_per_100g
        self.protein_per_100g = protein_per_100g

    def get_total_kcal(self):
        """Returns the total kcal when fully grown."""
        return (self.weight_full_grown * 1000 / 100) * self.kcal_per_100g

    def get_total_protein(self):
        """Returns the total protein when fully grown."""
        return (self.weight_full_grown * 1000 / 100) * self.protein_per_100g


class Person:
    def __init__(self, name, age, gender):
        self.name = name
        self.age = age
        self.gender = gender
        self.pregnant = False if gender == "Male" else None  # Only females can be pregnant

    def age_one_year(self):
        """Increments the age by one year."""
        self.age += 1

    def become_pregnant(self):
        """Sets pregnancy status if female and not already pregnant."""
        if self.gender == "Female" and self.pregnant is None:
            self.pregnant = True

    def give_birth(self):
        """Resets pregnancy and returns a new Person object."""
        if self.pregnant:
            self.pregnant = None
            return Person(name=f"Baby_{random.randint(1000, 9999)}", age=0, gender=random.choice(["Male", "Female"]))
        return None

    def can_be_pregnant(self):
        return self.gender == "Female" and self.pregnant is not None and self.age > 18


class PopulationManager:
    def __init__(self):
        self.people = []
        self.food_sources = []

    def add_person(self, person):
        self.people.append(person)

    def add_food_source(self, plant):
        self.food_sources.append(plant)

    def age_population(self):
        """Ages all persons by one year."""
        for person in self.people:
            person.age_one_year()

    def handle_births(self):
        """Handles births for pregnant women."""
        new_people = []
        for person in self.people:
            if person.pregnant:
                baby = person.give_birth()
                if baby:
                    new_people.append(baby)
        self.people.extend(new_people)

    def consume_food(self, daily_kcal_needed=2000):
        """Simulates daily food consumption."""
        total_kcal_available = sum(plant.get_total_kcal() for plant in self.food_sources)
        total_people = len(self.people)
        total_kcal_needed = total_people * daily_kcal_needed

        if total_kcal_available >= total_kcal_needed:
            # make people pregnant when surplus
            for person in random.sample(filter(lambda p: p.can_be_pregnant(), self.people),
                                        (total_kcal_available - total_kcal_needed) // daily_kcal_needed):
                if person.gender == "Female" and person.pregnant is None:
                    person.become_pregnant()
            return f"Population is well-fed. {total_kcal_available - total_kcal_needed} kcal surplus."
        else:
            return f"Food shortage! Deficit of {total_kcal_needed - total_kcal_available} kcal."


# Example usage
if __name__ == "__main__":
    manager = PopulationManager()

    # Add food sources
    apple = Plant("Apple", "Malum vulgaris", "Temperate", "Moderate", 83, 3.04, 256.9, 7.9)
    banana = Plant("Banana", "Musa minor", "Mediterranean", "High", 181, 4.85, 26.1, 7.9)

    manager.add_food_source(apple)
    manager.add_food_source(banana)

    # Add people
    manager.add_person(Person("Alice", 25, "Female"))
    manager.add_person(Person("Bob", 30, "Male"))

    # Simulate a year
    manager.age_population()
    manager.consume_food()
