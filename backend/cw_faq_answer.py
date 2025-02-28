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

if __name__ == "__main__":
    """Direct execution for input and FAQ answer generation."""
    product_name = input("Enter Product/Company Name: ").strip()
    product_description = input("Enter Product/Company Description: ").strip()
    target_audience = input("Enter Target Audience: ").strip()
    question = input("Enter the question you want an answer for: ").strip()

    creativity = input("Enter Creativity Level (Normal, High): ").strip().capitalize()
    while creativity not in ["Normal", "High"]:
        print("Invalid choice! Please enter either 'Normal' or 'High'.")
        creativity = input("Enter Creativity Level (Normal, High): ").strip().capitalize()

    if not product_name or not product_description or not target_audience or not question:
        print("Error: Please provide all required inputs.")
    else:
        print("\nGenerating Answer...\n")
        faq_answer = str(generate_faq_answer(product_name, product_description, target_audience, question, creativity))
        
        print("Generated FAQ Answer:")
        faq_answer_data = json.loads(faq_answer)  ## FAQ ANSWER RESPONSE
        print(faq_answer_data, type(faq_answer_data))
