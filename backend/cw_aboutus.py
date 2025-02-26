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
    temperature=0.7,  # This will be adjusted based on the creativity level input
    model="groq/llama3-70b-8192",
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


if __name__ == "__main__":
    """Direct execution for input and 'About Us' generation."""
    product_name = input("Enter Product/Company Name: ").strip()
    product_description = input("Enter Product/Company Description: ").strip()
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

    if not product_name or not product_description or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating 'About Us' section...\n")
        about_us = str(generate_about_us(product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated 'About Us' Section:")
        about_us_data = json.loads(about_us)
        print(about_us_data,type(about_us_data))
        # Display all keys
        print("Keys:", about_us_data.keys())

        # Display keys of the nested dictionary
        print("Nested Keys:", about_us_data['about_us'].keys())