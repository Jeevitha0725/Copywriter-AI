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

def generate_faqs(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate a structured list of FAQs based on user inputs."""

    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: FAQ Generator
    faq_writer = Agent(
        llm=llm,
        role="FAQ Specialist",
        goal=(f"Generate a list of frequently asked questions (FAQs) for {product_name}, "
              f"considering its features, benefits, and target audience ({target_audience}). "
              f"Ensure the tone of the FAQs matches the selected tone: {tone_of_voice}."),
        backstory="You specialize in crafting clear and informative FAQs tailored to product needs.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Ensure the tone of voice matches the provided specification.",
            "Only provide a list of FAQs without additional information.",
            "Avoid unnecessary details and keep the questions relevant."
        ]
    )

    # Task: Generating FAQs
    faq_task = Task(
        description=(
            "Generate a list of frequently asked questions (FAQs) based on the provided details.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            'Output must strictly be a Python dictionary formatted as: {"FAQ": ["question1", "question2", "question3", ...]}'
        ),
        expected_output='{"FAQ": ["Generated Question 1", "Generated Question 2", "Generated Question 3"]}',
        agent=faq_writer,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[faq_writer],
        tasks=[faq_task],
        verbose=False
    )

    # Generate FAQ content
    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary


# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set product details and generate content."""
    return generate_faqs(product_name, product_description, target_audience, creativity, tone_of_voice)

if __name__ == "__main__":
    # Initialize variables with default values
    product_name = "Unknown"
    product_description = "Unknown"
    target_audience = "Unknown"
    creativity = "Normal"
    tone_of_voice = "Professional"

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
        print("\nGenerating FAQs...\n")
        faqs = str(generate_faqs(product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated FAQs:")
        faqs_data = json.loads(faqs)  ## FAQs RESPONSE
        print(faqs_data, type(faqs_data))  
        # # Display all keys
        # print("Keys:", faqs_data.keys())

        # # Display keys of the nested dictionary
        # print("Nested Keys:", faqs_data['FAQ'])
