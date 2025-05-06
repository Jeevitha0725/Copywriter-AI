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

def generate_faq_answer(product_name, product_description, target_audience, question, creativity):
    """Generate a concise answer for a specific FAQ based on user inputs."""

    temperature = 1.0 if creativity.lower() == "high" else 0.7  
    llm.temperature = temperature  

    faq_answer_agent = Agent(
        llm=llm,
        role="FAQ Answer Specialist",
        goal=f"Provide a concise answer for the question: '{question}'. Consider the product {product_name}, its description, and the target audience ({target_audience}).",
        backstory="You are an expert in crafting short, clear, and to-the-point answers to FAQs.",
        verbose=False,
        allow_deviation=False,
        rules=[
            "Strictly return only a dictionary object.",
            "Provide only the answer to the asked question without additional context.",
            "Avoid unnecessary details and keep the response short and precise."
        ]
    )


    faq_answer_task = Task(
        description=(
            "Generate a concise answer for the given question based on the provided details.\n\n"
            f"Product Name: {product_name}\n"
            f"Product Description: {product_description}\n"
            f"Target Audience: {target_audience}\n"
            f"User Question: {question}\n"
            f"Creativity Level: {creativity}\n\n"
            'Output must strictly be a Python dictionary formatted as: {"faq answer": {"{user input question}": "{concise generated answer}"}}'
        ),
        expected_output='{"faq answer": {"{user input question}": "{concise generated answer}"}}',
        agent=faq_answer_agent,
    )

    crew = Crew(
        agents=[faq_answer_agent],
        tasks=[faq_answer_task],
        verbose=False
    )

    result = crew.kickoff(inputs={})
    return result  # Directly return the dictionary


# Function to update product details
def set_product_details(product_name, product_description, target_audience, question, creativity):
    """Set product details and generate content."""
    return generate_faq_answer(product_name, product_description, target_audience, question, creativity)

if __name__ == "__main__":
    # Initialize variables with default values
    product_name = "Unknown"
    product_description = "Unknown"
    target_audience = "Unknown"
    question = "Unknown"
    creativity = "Normal"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            product_name = data.get("product_name", "Unknown")
            product_description = data.get("product_description", "Unknown")
            target_audience = data.get("target_audience", "Unknown")
            question = data.get("question", "Unknown")
            creativity = data.get("creativity", "Normal")
        else:
            print("Warning: Unable to fetch data from Flask API. Using default values.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Using default values.")

    set_product_details(product_name, product_description, target_audience, question, creativity)

    print("\nLanding Page Configuration:")
    print(f"Product Name: {product_name}")
    print(f"Product Description: {product_description}")
    print(f"Target Audience: {target_audience}")
    print(f"Question: {question}")
    print(f"Creativity Level: {creativity}")

    if not product_name or not product_description or not target_audience or not question:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating Answer...\n")
        faq_answer = str(generate_faq_answer(product_name, product_description, target_audience, question, creativity))
        
        print("Generated FAQ Answer:")
        faq_answer_data = json.loads(faq_answer)  ## FAQ ANSWER RESPONSE
        print(faq_answer_data, type(faq_answer_data))
