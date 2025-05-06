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
    temperature=0.7,  # Controls creativity level
    model=model_name,
    api_key=api_key
)

def generate_testimonials(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate testimonials for a product."""
    
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    testimonials_writer = Agent(
        llm=llm,
        role="Customer Feedback Analyst",
        goal=f"Generate compelling customer testimonials for {product_name}, emphasizing its impact and value.",
        backstory="You specialize in curating and writing authentic testimonials that build brand trust.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Ensure testimonials sound natural and credible.",
            "Provide at least two unique testimonials with user and company details.",
            "Avoid unnecessary information and keep the content concise."
        ]
    )

    testimonials_task = Task(
        description=(
            "Generate a structured set of customer testimonials.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            'Output must strictly be a Python dictionary with "testimonials" key, containing "title", "description", and "testimonialLists" keys.'
        ),
        expected_output='{"testimonials": {"title": "Testimonials", "description": "Generated Description", "testimonialLists": [{"comment": "Generated Comment", "user": "Generated User", "company": "Generated Company"}]}}',
        agent=testimonials_writer,
    )

    crew = Crew(
        agents=[testimonials_writer],
        tasks=[testimonials_task],
        verbose=False
    )

    return crew.kickoff(inputs={})

# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set product details and generate content."""
    return generate_testimonials(product_name, product_description, target_audience, creativity, tone_of_voice)

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
        print("\nGenerating Testimonials...\n")
        testimonials = json.loads(str(generate_testimonials(product_name, product_description, target_audience, creativity, tone_of_voice)))  ## TESTIMONIALS RESPONSE

        print("Generated Testimonials:")
        print(json.dumps(testimonials, indent=4))
