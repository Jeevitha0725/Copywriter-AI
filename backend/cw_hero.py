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
    temperature=0.7,  # Adjusted based on creativity level input
    model=model_name,
    api_key=api_key
)

def generate_hero_section(company_name, company_description, company_type, target_audience, creativity, tone_of_voice):
    """Generate a structured Hero Section based on user inputs."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Brand Strategist
    hero_section_writer = Agent(
        llm=llm,
        role="Brand Strategist",
        goal=f"Write an engaging Hero Section for {company_name}, highlighting how {company_name} ({company_type}) serves {target_audience}.",
        backstory="You specialize in crafting impactful and concise brand messaging that captures attention immediately.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Ensure the tone of voice matches the provided specification.",
            "Provide a clear and engaging Hero Section.",
            "Avoid unnecessary information and focus on impact.",
        ]
    )

    # Task: Generating the Hero Section
    hero_section_task = Task(
        description=(
            "Create a structured Hero Section based on the provided details.\n\n"
            f"Company Name: {company_name}\n"
            f"Company Description: {company_description}\n"
            f"Company Type: {company_type}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            "Output must strictly be a Python dictionary with the following format: \n"
            "{\"heroSection\": {\"title\": \"Generated Title\", \"description\": \"Generated Description\"}}"
        ),
        expected_output='{"heroSection": {"title": "Generated Title", "description": "Generated Description"}}',
        agent=hero_section_writer,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[hero_section_writer],
        tasks=[hero_section_task],
        verbose=False
    )

    # Generate Hero Section content
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary


# Function to update company details
def set_company_details(company_name, company_description, company_type, target_audience, creativity, tone_of_voice):
    """Set company details and generate content."""
    return generate_hero_section(company_name, company_description, company_type, target_audience, creativity, tone_of_voice)

if __name__ == "__main__":
    # Initialize variables with default values
    company_name = "Unknown"
    company_description = "Unknown"
    company_type = "Unknown"
    target_audience = "Unknown"
    creativity = "Normal"
    tone_of_voice = "Professional"
    url = ""

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            company_name = data.get("company_name", "Unknown")
            company_description = data.get("company_description", "Unknown")
            company_type = data.get("company_type", "Unknown")
            target_audience = data.get("target_audience", "Unknown")
            creativity = data.get("creativity", "Normal")
            tone_of_voice = data.get("tone_of_voice", "Professional")
        else:
            print("Warning: Unable to fetch data from Flask API. Using default values.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Using default values.")

    set_company_details(company_name, company_description, company_type, target_audience, creativity, tone_of_voice)

    print("\nCompany Configuration:")
    print(f"Company Name: {company_name}")
    print(f"Company Description: {company_description}")
    print(f"Company Type: {company_type}")
    print(f"Target Audience: {target_audience}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")


    if not company_name or not company_description or not company_type or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating 'Hero Section'...\n")
        hero_section = str(generate_hero_section(company_name, company_description, company_type, target_audience, creativity, tone_of_voice))
        
        print("Generated 'Hero Section':")
        hero_section_data = json.loads(hero_section)
        print(hero_section_data, type(hero_section_data)) ## HERO SECTION RESPONSE
        # Display all keys
        print("Keys:", hero_section_data.keys())

        # Display keys of the nested dictionary
        print("Nested Keys:", hero_section_data['heroSection'].keys())