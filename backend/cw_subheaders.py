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
    temperature=0.7,  # This will be adjusted based on the creativity level input
    model="groq/llama3-70b-8192",
    api_key=api_key
)

def generate_subheadings(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Generate structured subheadings for a given topic with specified creativity and tone."""
    
    # Adjust temperature based on creativity level
    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    # Agent: Content Strategist
    planner = Agent(
        llm=llm,
        role="Content Strategist",
        goal=(
            f"Generate a concise list of essential subheadings for the topic: {product_name}, "
            f"ensuring alignment with the provided context, target audience ({target_audience}), and tone ({tone_of_voice}). "
            "Keep it minimal and relevant."
        ),
        backstory="You are an expert in structuring content with only the most relevant subheadings.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a JSON object.",
            "Ensure the tone of voice matches the provided specification.",
            "Provide a concise, structured, and minimal set of subheadings without extra descriptions.",
            "Do not include additional explanations or context beyond the subheadings."
        ]
    )

    # Task: Generating Subheadings
    generate_subheadings_task = Task(
        description=(
            "Generate a structured and concise list of essential subheadings, ensuring clarity and relevance.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"Creativity Level: {creativity}\n"
            f"Tone of Voice: {tone_of_voice}\n\n"
            "Output must strictly follow this JSON format: {'subheadings': ['Heading 1', 'Heading 2', ...]}."
        ),
        expected_output='{"subheadings": ["Heading 1", "Heading 2", ...]}',
        agent=planner,
    )

    # Crew: Executing the Task
    crew = Crew(
        agents=[planner],
        tasks=[generate_subheadings_task],
        verbose=False
    )

    # Generate structured subheadings
    result = crew.kickoff(inputs={})

    # Extracting subheadings correctly from CrewOutput
    subheadings_json = result.final_output if hasattr(result, "final_output") else str(result)

    try:
        subheadings_data = json.loads(subheadings_json)  # Convert to dictionary
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format received from the model.")

    return subheadings_data  # Returning as a dictionary


# Function to update product details
def set_product_details(product_name, product_description, target_audience, creativity, tone_of_voice):
    """Set product details and generate content."""
    return generate_subheadings(product_name, product_description, target_audience, creativity, tone_of_voice)

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
        print("\nGenerating subheadings...\n")
        subheadings = generate_subheadings(product_name, product_description, target_audience, creativity, tone_of_voice)
        print(subheadings,type(subheadings))  ## SUBHEADER RESPONSE
        # print("Generated Subheadings:")
        # for subheading in subheadings.get("subheadings", []):
        #     print(f"🔹 {subheading}")
