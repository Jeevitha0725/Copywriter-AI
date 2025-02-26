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
    temperature=0.7,  # Controls creativity level
    model="groq/llama3-70b-8192",
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

if __name__ == "__main__":
    """Direct execution for input and testimonial generation."""
    product_name = input("Enter Product Name: ").strip()
    product_description = input("Enter Product Description: ").strip()
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
        print("\nGenerating Testimonials...\n")
        testimonials = json.loads(str(generate_testimonials(product_name, product_description, target_audience, creativity, tone_of_voice)))

        print("Generated Testimonials:")
        print(json.dumps(testimonials, indent=4))
