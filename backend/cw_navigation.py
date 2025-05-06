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
    temperature=0.7,  # Adjust temperature for creativity
    model=model_name,
    api_key=api_key
)

def generate_navigation(company_name, company_type, product_name, product_description, creativity, tone_of_voice):
    """Generate a structured navigation menu based on user inputs."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: UX Designer
    navigation_designer = Agent(
        llm=llm,
        role="UX Designer",
        goal=(f"Create a structured navigation menu for {company_name} ({company_type}) offering {product_name}. "
              f"Ensure the tone is {tone_of_voice} and aligns with the product description: {product_description}"),
        backstory="Expert in UX/UI design, specializing in minimal and effective navigation menus.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "ONLY 4 Navigation Option must be generated"
            "Strictly return only a dictionary object.",
            "Ensure a structured navigation format with key sections.",
            "Avoid unnecessary information and stick to a clean, user-friendly structure."
        ]
    )

    # Task: Generating the Navigation Section
    navigation_task = Task(
        description=(
            "Create a structured and user-friendly navigation menu based on the provided details.\n\n"
            f"Company Name: {company_name}\n"
            f"Company Type: {company_type}\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            'Output must strictly be a Python dictionary with a "navigation" key containing an array of menu items.'
        ),
        expected_output='{"navigation": [{"label":"Home"}, {"label": "Products", "dropdown": ["Electronics", "Clothing", "Books", "Home & Garden"]}, {"label": "Services", "dropdown": ["Web Development", "Marketing", "Consulting"]},{ "label":"Contact"}]}',
        agent=navigation_designer,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[navigation_designer],
        tasks=[navigation_task],
        verbose=False
    )

    # Generate Navigation content
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary

# Function to update company and product details
def set_details(company_name, company_type, product_name, product_description, creativity, tone_of_voice):
    """Set details and generate content."""
    return generate_navigation(company_name, company_type, product_name, product_description, creativity, tone_of_voice)

if __name__ == "__main__":
    # Initialize variables with default values
    company_name = "Unknown"
    company_type = "Unknown"
    product_name = "Unknown"
    product_description = "Unknown"
    creativity = "Normal"
    tone_of_voice = "Professional"
    url = ""

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            company_name = data.get("company_name", "Unknown")
            company_type = data.get("company_type", "Unknown")
            product_name = data.get("product_name", "Unknown")
            product_description = data.get("product_description", "Unknown")
            creativity = data.get("creativity", "Normal")
            tone_of_voice = data.get("tone_of_voice", "Professional")
        else:
            print("Warning: Unable to fetch data from Flask API. Using default values.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Using default values.")

    set_details(company_name, company_type, product_name, product_description, creativity, tone_of_voice)

    print("\nConfiguration Details:")
    print(f"Company Name: {company_name}")
    print(f"Company Type: {company_type}")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")


    if not company_name or not company_type or not product_name or not product_description:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating Navigation Menu...\n")
        navigation = str(generate_navigation(company_name, company_type, product_name, product_description, creativity, tone_of_voice))
        
        print("Generated Navigation Menu:")
        navigation_data = json.loads(navigation)  ## NAVIGATION RESPONSE
        print(navigation_data, type(navigation_data))
        