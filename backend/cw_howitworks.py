import os
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
import json, requests
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

def generate_how_it_works(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate a well-structured 'How It Works' section based on user inputs."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Process Strategist
    how_it_works_writer = Agent(
        llm=llm,
        role="Process Strategist",
        goal=(f"Write a clear and structured 'How It Works' section for {product_name}, explaining its process, benefits, and key services in {tone_of_voice} tone."),
        backstory="You specialize in creating easy-to-understand process guides that engage users.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Ensure the tone of voice matches the provided specification.",
            "Provide a structured and easy-to-follow 'How It Works' section.",
            "Avoid unnecessary information and stick to the given details."
        ]
    )

    # Task: Generating the How It Works Section
    how_it_works_task = Task(
        description=(
            "Create a structured 'How It Works' section based on the provided details.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            'Output must strictly be a Python dictionary with the following format: \n'
            '{\n"howItWorksSection": {\n"title": "Generated Title", \n"description": "Generated Description", \n"services": [\n{"title": "Service Title", "description": "Service Description"}\n]\n}\n}'
        ),
        expected_output='{"howItWorksSection": {"title": "Generated Title", "description": "Generated Description", "services": [{"title": "Generated Service", "description": "Generated Service Description"}]}}',
        agent=how_it_works_writer,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[how_it_works_writer],
        tasks=[how_it_works_task],
        verbose=False
    )

    # Generate How It Works content
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary


# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set product details and generate content."""
    return generate_how_it_works(product_name, product_description, target_audience, creativity, tone_of_voice)

if __name__ == "__main__":
    # Initialize variables with default values
    product_name = "Unknown"
    product_description = "Unknown"
    target_audience = "Unknown"
    creativity = "Normal"
    tone_of_voice = "Professional"
    url = ""

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            product_name = data.get("product_name", "Unknown")
            product_description = data.get("product_description", "Unknown")
            target_audience = data.get("target_audience", "Unknown")
            creativity = data.get("creativity", "Normal")
            tone_of_voice = data.get("tone_of_voice", "Professional")
        else:
            print("Warning: Unable to fetch data from Flask API. Using default values.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Using default values.")

    set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice)

    print("\nProduct Configuration:")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Target Audience: {target_audience}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")


    if not product_name or not product_description or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating 'How It Works' section...\n")
        how_it_works = str(generate_how_it_works(product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated 'How It Works' Section:")
        how_it_works_data = json.loads(how_it_works)  ## HOW IT WORKS RESPONSE
        print(how_it_works_data, type(how_it_works_data))
        # # Display all keys
        # print("Keys:", how_it_works_data.keys())

        # # Display keys of the nested dictionary
        # print("Nested Keys:", how_it_works_data['howItWorksSection'].keys())
