import os
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq
import json, requests

# Set the API key
os.environ["GROQ_API_KEY"] = "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"

os.environ["OTEL_SDK_DISABLED"] = "true"

# Retrieve API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("API Key is missing. Set GROQ_API_KEY as an environment variable.")

# Initialize the model
llm = ChatGroq(
    temperature=0.7,  
    model="groq/llama3-70b-8192",
    api_key=api_key
)

def generate_headline(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate a single compelling headline in strict JSON format."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Marketing Copywriter with strict rules
    copywriter = Agent(
        llm=llm,
        role="Marketing Copywriter",
        goal=f"Craft a single, engaging headline for {product_name} with a {tone_of_voice} tone.",
        backstory="An expert in crafting precise, engaging marketing headlines with a deep understanding of audience psychology.",
        verbose=False,
        allow_deviation=False,  # Prevents the agent from adding extra details
        rules=[
            "Strictly return only a JSON object.",
            "Do not include any additional descriptions, explanations, or context.",
            "The output format must be: {\"headline\": \"Generated headline text\"}.",
            f"The tone of voice must strongly reflect: {tone_of_voice}.",
            "Ensure that the headline is engaging and aligns with the target audience."
        ]
    )

    # Task: Generating a Single Headline
    generate_headline_task = Task(
        description=f"Generate a JSON formatted headline for {product_name}.",
        agent=copywriter,
        expected_output='{"headline": "Compelling marketing headline"}'
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[copywriter],
        tasks=[generate_headline_task],
        verbose=False
    )

    # Generate headline
    result = crew.kickoff(inputs={})

    # Extracting headline correctly from CrewOutput
    headline_json = result.final_output if hasattr(result, "final_output") else str(result)

    try:
        dictionary_data = json.loads(headline_json)  # Convert to dictionary
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format received from the model.")

    return dictionary_data  # Returning as a dictionary

# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set product details and generate content."""
    return generate_headline(product_name, product_description, target_audience, creativity, tone_of_voice)

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

    print("\nProduct Configuration:")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Target Audience: {target_audience}")
    print(f"Creativity Level: {creativity}")
    print(f"Tone of Voice: {tone_of_voice}")


    if not product_name or not product_description or not target_audience:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating headline...\n")
        headline = generate_headline(product_name, product_description, target_audience, creativity, tone_of_voice)  ## HEADLINE REPONSE

        # print(json.dumps(headline, indent=2))  # Pretty-print the JSON output
        print(type(headline))  # Confirming the dictionary type
