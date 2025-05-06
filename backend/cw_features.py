import os
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
import json
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("CHAT_API_KEY")
model_name = os.getenv("CHAT_MODEL_NAME")

if not api_key:
    raise ValueError("API Key is missing. Set GROQ_API_KEY as an environment variable.")

# Initialize the model
llm = ChatGroq(
    temperature=0.7,  # This will be adjusted based on the creativity level input
    model=model_name,
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

# Function to update company and product details
def set_company_product_details(company_name, company_description, product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set company and product details and generate content."""
    return generate_features(company_name, company_description, product_name, product_description, target_audience, creativity, tone_of_voice)

if __name__ == "__main__":
    # Initialize variables with default values
    company_name = "Unknown"
    company_description = "Unknown"
    product_name = "Unknown"
    product_description = "Unknown"
    target_audience = "Unknown"
    creativity = "Normal"
    tone_of_voice = "Professional"
    url=""

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            company_name = data.get("company_name", "Unknown")
            company_description = data.get("company_description", "Unknown")
            product_name = data.get("product_name", "Unknown")
            product_description = data.get("product_description", "Unknown")
            target_audience = data.get("target_audience", "Unknown")
            creativity = data.get("creativity", "Normal")
            tone_of_voice = data.get("tone_of_voice", "Professional")
        else:
            print("Warning: Unable to fetch data from Flask API. Using default values.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Using default values.")

    set_company_product_details(company_name, company_description, product_name, product_description, target_audience, creativity, tone_of_voice)

    print("\nCompany & Product Configuration:")
    print(f"Company Name: {company_name}")
    print(f"Company Description: {company_description}")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Target Audience: {target_audience}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")

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
