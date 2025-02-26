import os
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
import json

# Set the API key
os.environ["GROQ_API_KEY"] = "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"

# Retrieve API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("API Key is missing. Set GROQ_API_KEY as an environment variable.")

# Initialize the model
llm = ChatGroq(
    temperature=0.7,  # Adjusted based on creativity level input
    model="groq/llama3-70b-8192",
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


if __name__ == "__main__":
    """Direct execution for input and 'Hero Section' generation."""
    company_name = input("Enter Company Name: ").strip()
    company_description = input("Enter Company Description: ").strip()
    company_type = input("Enter Company Type: ").strip()
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

    if not company_name or not company_description or not company_type or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating 'Hero Section'...\n")
        hero_section = str(generate_hero_section(company_name, company_description, company_type, target_audience, creativity, tone_of_voice))
        
        print("Generated 'Hero Section':")
        hero_section_data = json.loads(hero_section)
        print(hero_section_data, type(hero_section_data))
        # Display all keys
        print("Keys:", hero_section_data.keys())

        # Display keys of the nested dictionary
        print("Nested Keys:", hero_section_data['heroSection'].keys())