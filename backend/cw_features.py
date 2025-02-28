import os
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
import json

# Set the API key
os.environ["GROQ_API_KEY"] = "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"

os.environ["OTEL_SDK_DISABLED"] = "true"

# Retrieve API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("API Key is missing. Set GROQ_API_KEY as an environment variable.")

# Initialize the model
llm = ChatGroq(
    temperature=0.7,  # This will be adjusted based on the creativity level input
    model="groq/llama3-70b-8192",
    api_key=api_key
)

def generate_features(company_name, company_description, product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate a list of features for a product in JSON format."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Feature Extractor
    feature_extractor = Agent(
        llm=llm,
        role="Feature Extractor",
        goal=f"Extract only key features of {product_name} from {company_name} in JSON format.",
        backstory="An expert in identifying core product strengths and features for effective marketing.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            'Output must be in JSON format: {"features": "feature1", "feature2", "feature3"]}.',
            "Do not include explanations, benefits, or any additional information.",
            "Ensure features are concise and product-focused.",
            "Match the tone of voice specified.",
            "Extract exactly 3-5 key features from the product description."
        ]
    )

    # Task: Extract Features
    feature_task = Task(
        description=(
            "Generate a JSON-formatted list of key features based on the provided details.\n\n"
            f"Company Name: {company_name}\n"
            f"Company Description: {company_description}\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            "Output format must be: {\"features\": [\"Feature 1\", \"Feature 2\", \"Feature 3\"]}"
        ),
        expected_output='{"features": ["feature1", "feature2", "feature3"]}',
        agent=feature_extractor,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[feature_extractor],
        tasks=[feature_task],
        verbose=False
    )

    # Generate Features
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary

if __name__ == "__main__":
    """Direct execution for input and feature extraction."""
    company_name = input("Enter Company Name: ").strip()
    company_description = input("Enter Company Description: ").strip()
    product_name = input("Enter Product Name: ").strip()
    product_description = input("Enter Product Description: ").strip()
    target_audience = input("Enter Target Audience: ").strip()

    creativity = input("Enter Creativity Level (Normal, High): ").strip().capitalize()
    while creativity not in ["Normal", "High"]:
        print("Invalid choice! Please enter either 'Normal' or 'High'.")
        creativity = input("Enter Creativity Level (Normal, High): ").strip().capitalize()

    tone_options = [
        "Professional", "Childish", "Luxurious", "Friendly", "Formal", "Humorous",
        "Confident", "Exciting", "Surprised", "Academic", "Optimistic", "Creative"
    ]
    
    print("\nSelect Tone of Voice:")
    for i, tone in enumerate(tone_options, 1):
        print(f"{i}. {tone}")

    try:
        tone_choice = int(input("\nEnter the number corresponding to the tone of voice: "))
        if 1 <= tone_choice <= len(tone_options):
            tone_of_voice = tone_options[tone_choice - 1]
        else:
            raise ValueError
    except ValueError:
        print("Invalid choice! Defaulting to 'Professional'.")
        tone_of_voice = "Professional"

    if not company_name or not company_description or not product_name or not product_description or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating Features...\n")
        features = str(generate_features(company_name, company_description, product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated Features:")
        features_data = json.loads(features)  ## FEATURES RESPONSE
        print(features_data, type(features_data))
        # # Display all keys
        # print("Keys:", features_data.keys())
        # # Display keys of the nested dictionary
        # print("Nested Keys:", features_data['features'])
