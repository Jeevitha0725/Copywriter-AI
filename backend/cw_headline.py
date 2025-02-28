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

if __name__ == "__main__":
    """Direct execution for input and headline generation."""
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
        print("\nGenerating headline...\n")
        headline = generate_headline(product_name, product_description, target_audience, creativity, tone_of_voice)  ## HEADLINE REPONSE

        # print(json.dumps(headline, indent=2))  # Pretty-print the JSON output
        print(type(headline))  # Confirming the dictionary type
