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


if __name__ == "__main__":
    """Direct execution for input and subheading generation."""
    product_name = input("Enter Product/Topic Name: ").strip()
    product_description = input("Enter Product/Topic Description: ").strip()
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
        print("\nGenerating subheadings...\n")
        subheadings = generate_subheadings(product_name, product_description, target_audience, creativity, tone_of_voice)
        print(type(subheadings))
        print("Generated Subheadings:")
        for subheading in subheadings.get("subheadings", []):
            print(f"🔹 {subheading}")
