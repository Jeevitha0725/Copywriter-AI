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

def generate_about_us(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate a well-structured 'About Us' section based on user inputs."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Content Strategist
    about_us_writer = Agent(
        llm=llm,
        role="Brand Storyteller",
        goal=(f"Write an engaging and well-structured 'About Us' section for {product_name}, "
              f"highlighting its mission, values, target audience ({target_audience}), and tone ({tone_of_voice})."),
        backstory="You specialize in writing compelling brand stories that connect with customers.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Ensure the tone of voice matches the provided specification.",
            "Provide a concise yet impactful 'About Us' section.",
            "Avoid unnecessary information and stick to the given details."
        ]
    )

    # Task: Generating the About Us Section
    about_us_task = Task(
        description=(
            "Create a structured and compelling 'About Us' section based on the provided details.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            'Output must strictly be a Python dictionary with "title" and "description" keys.'
        ),
        expected_output='{"about_us": {"title": "Generated Title for about us content", "description": "Generated Description for about us content"}}',
        agent=about_us_writer,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[about_us_writer],
        tasks=[about_us_task],
        verbose=False
    )

    # Generate About Us content
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary


# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone):
    """Set product details and generate content."""
    return generate_about_us(product_name, product_description, target_audience, creativity, tone)

if __name__ == "__main__":
    # Initialize variables with default values
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

    print("\nLanding Page Configuration:")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Target Audience: {target_audience}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")


    if not product_name or not product_description or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating 'About Us' section...\n")
        about_us = str(generate_about_us(product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated 'About Us' Section:")
        about_us_data = json.loads(about_us)  ## ABOUT US RESPONSE
        print(about_us_data,type(about_us_data)) 
        # # Display all keys
        # print("Keys:", about_us_data.keys())

        # # Display keys of the nested dictionary
        # print("Nested Keys:", about_us_data['about_us'].keys())