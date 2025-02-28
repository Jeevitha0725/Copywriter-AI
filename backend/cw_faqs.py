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
    temperature=0.7,  # This will be adjusted based on the creativity level input
    model="groq/llama3-70b-8192",
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


if __name__ == "__main__":
    """Direct execution for input and FAQ generation."""
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
        print("\nGenerating FAQs...\n")
        faqs = str(generate_faqs(product_name, product_description, target_audience, creativity, tone_of_voice))
        
        print("Generated FAQs:")
        faqs_data = json.loads(faqs)  ## FAQs RESPONSE
        print(faqs_data, type(faqs_data))  
        # # Display all keys
        # print("Keys:", faqs_data.keys())

        # # Display keys of the nested dictionary
        # print("Nested Keys:", faqs_data['FAQ'])
