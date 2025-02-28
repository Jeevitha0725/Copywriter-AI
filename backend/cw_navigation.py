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
    temperature=0.7,  # Adjust temperature for creativity
    model="groq/llama3-70b-8192",
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

if __name__ == "__main__":
    """Direct execution for input and navigation menu generation."""
    company_name = input("Enter Company Name: ").strip()
    company_type = input("Enter Company Type: ").strip()
    product_name = input("Enter Product Name: ").strip()
    product_description = input("Enter Product Description: ").strip()
    
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

    if not company_name or not company_type or not product_name or not product_description:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating Navigation Menu...\n")
        navigation = str(generate_navigation(company_name, company_type, product_name, product_description, creativity, tone_of_voice))
        
        print("Generated Navigation Menu:")
        navigation_data = json.loads(navigation)  ## NAVIGATION RESPONSE
        print(navigation_data, type(navigation_data))
        