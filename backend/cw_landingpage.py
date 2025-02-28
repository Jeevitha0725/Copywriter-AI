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

# Tone options
tone_options = [
    "Professional", "Childish", "Luxurious", "Friendly", "Formal", "Humorous",
    "Confident", "Exciting", "Surprised", "Academic", "Optimistic", "Creative"
]

def generate_content(selected_sections, company_name, company_type, company_description, audience, tone_of_voice):
    """Generate content for selected sections with strict JSON-only output."""
    
    content_dict = {}
    
    if "hero" in selected_sections:
        content_dict["hero"] = Task(
            description=f"Generate a JSON formatted hero section with a title and description for {company_name}.",
            agent=Agent(
                llm=llm,
                role="Brand Strategist",
                goal=f"Craft an engaging hero section for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in brand storytelling and digital marketing, specializing in compelling messaging.",
                verbose=False,
                allow_deviation=False,  
                rules=[
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format."
                ]
            ),
            expected_output='{"hero_section": {"title": "Innovate with Syncner", "description": "Take your business to the next level with our customized solutions."}}'
        )

    if "navigation" in selected_sections:
        content_dict["navigation"] = Task(
            description=f"Generate a JSON formatted concise navigation menu with key sections for {company_name}.",
            agent=Agent(
                llm=llm,
                role="UX Designer",
                goal=f"Design a concise navigation menu for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in UX/UI design, specializing in minimal and effective navigation menus.",
                verbose=False,
                allow_deviation=False,  
                rules=[
                    "ONLY 4 NAVIGATION OPTION MUST BE GENERATION"
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format."
                ]
            ),
            expected_output='{"navigation": [{"label":"Home"}, {"label": "Products", "dropdown": ["Electronics", "Clothing", "Books", "Home & Garden"]}, {"label": "Services", "dropdown": ["Web Development", "Marketing", "Consulting"]},{"label":"About Us"},{ "label":"Contact"}]}'
        )

    if "howitworks" in selected_sections:
        content_dict["howitworks"] = Task(
            description=f"Generate a JSON formatted 'How It Works' section with a title, description, and key service steps for {company_name}.",
            agent=Agent(
                llm=llm,
                role="Business Process Strategist",
                goal=f"Craft a structured 'How It Works' section for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in business process design and customer journey mapping, specializing in clear and compelling communication.",
                verbose=False,
                allow_deviation=False,  
                rules=[
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format."
                ]
            ),
            expected_output=f'''{{
                "howItWorksSection": {{
                    "title": "Elevate Your Business with Customized Solutions from {company_name}",
                    "description": "Take your business to new heights with {company_name}. Our customized solutions and streamlined processes will help drive your success in a constantly evolving industry.",
                    "services": [
                        {{
                            "title": "Consultation",
                            "description": "Our team of experts will meet with you to understand your business needs and goals. We will discuss your design requirements, budget, and timeline."
                        }},
                        {{
                            "title": "Customized Solution",
                            "description": "Based on our consultation, we will design a tailored solution for your business that aligns with your specific needs. This may include creating a new brand identity, developing marketing materials, or revamping your website."
                        }}
                    ]
                }}
            }}'''
        )
    
    if "features" in selected_sections:
        content_dict["features"] = Task(
            description=f"Generate a JSON formatted features section highlighting the key benefits of {company_name}.",
            agent=Agent(
                llm=llm,
                role="Product Marketing Specialist",
                goal=f"Showcase the top features and benefits of {company_name}'s ({company_type}) offerings in a {tone_of_voice} tone.",
                backstory="Expert in product positioning and marketing, focused on highlighting value-driven features.",
                verbose=False,
                allow_deviation=False,  
                rules=[
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format."
                ]
            ),
            expected_output='{"features":["feature1", "feature2", "feature3"]}'
        )

        
    if "testimonials" in selected_sections:
        content_dict["testimonials"] = Task(
            description=f"Generate a JSON formatted response containing a testimonials section for {company_name}.",
            agent=Agent(
                llm=llm,
                role="Content Strategist",
                goal=f"Create a compelling testimonials section for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in content strategy, specializing in crafting persuasive and engaging testimonials.",
                verbose=False,
                allow_deviation=False,
                rules=[
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format.",
                    "Ensure that the testimonials include a title, description, and a list of user reviews."
                ]
            ),
            expected_output="""{
                "testimonials": {
                    "title": "Testimonials",
                    "description": "Don't just take our word for it, read from our extensive list of case studies and customer testimonials.",
                    "testimonialLists": [
                        {
                            "comment": "I have been using Syncner for my business needs and I am blown away by the efficiency and innovation they bring to the table. Their tailored solutions have truly helped streamline our processes and improve our overall operations. The team at Syncner is dedicated, knowledgeable, and always goes above and beyond to ensure their clients' success. Thank you Syncner for taking our business to the next level!",
                            "user": "Jane Cooper",
                            "company": "CEO SomeCompany"
                        },
                        {
                            "comment": "Syncner's innovative solutions have transformed our business operations. Their expertise and commitment to delivering excellence are unmatched. Highly recommend their services!",
                            "user": "John Doe",
                            "company": "CTO TechCorp"
                        }
                    ]
                }
            }"""
        )
        
    if "about_us" in selected_sections:
        content_dict["about_us"] = Task(
            description=f"Generate a JSON formatted response containing an About Us section for {company_name}.",
            agent=Agent(
                llm=llm,
                role="Brand Strategist",
                goal=f"Create an engaging About Us section for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in brand storytelling and content strategy, crafting compelling company backgrounds.",
                verbose=False,
                allow_deviation=False,
                rules=[
                    "Strictly return only a JSON object.",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format.",
                    "Ensure that the About Us section includes a title and description."
                ]
            ),
            expected_output="""{
                "aboutUsSection": {
                    "title": "Unlock Your Business's Full Potential with Syncner: Tailored Solutions for Maximum Success",
                    "description": "Syncner was founded by a team of designers with a passion for helping businesses reach their full potential. With years of experience in the design industry, we understand the challenges and complexities that come with running a successful business."
                }
            }"""
        )
    
    if "footer" in selected_sections:
        content_dict["footer"] = Task(
            description=f"Generate a JSON formatted response containing a footer for {company_name}.",
            agent=Agent(
                llm=llm,
                role="UX Designer",
                goal=f"Design a concise footer for {company_name} ({company_type}) with a {tone_of_voice} tone.",
                backstory="Expert in UX/UI design, specializing in minimal and effective navigation menus.",
                verbose=False,
                allow_deviation=False,
                rules=[
                    "ONLY 4 LINKS MUST BE GENERATED.",
                    "Strictly return only a JSON object.",
                    "Only provide response as per format",
                    "Do not include any additional descriptions, explanations, or context.",
                    "The output must be concise and in proper JSON format.",
                    "Do not include the 'icon' field in the response."
                ]
            ),
            expected_output=f"""{{
                "footer": {{
                    "Company name": "{company_name}",
                    "Links": [
                        {{"label": "Home"}},
                        {{"label": "Products", "dropdown": ["Electronics", "Clothing", "Books", "Home & Garden"]}},
                        {{"label": "Services", "dropdown": ["Web Development", "Marketing", "Consulting"]}},
                        {{"label": "About Us"}}
                    ]
                }}
            }}"""
        )



    if not content_dict:
        return "Invalid section selection."

    # Execute tasks with Crew
    results = Crew(tasks=list(content_dict.values()), verbose=False).kickoff()

    # Extract outputs and return as a dictionary
    output_dict = {key: results.tasks_output[i] for i, key in enumerate(content_dict.keys())}

    return output_dict  # Return outputs for all sections



if __name__ == "__main__":
    # Collect company details first
    company_name = input("Enter Company Name: ").strip()
    company_type = input("Enter Company Type (e.g., eCommerce, SaaS): ").strip()
    company_description = input("Enter Company Description: ").strip()
    audience = input("Enter Target Audience: ").strip()
    
    print("\nSelect Tone of Voice:")
    for i, tone in enumerate(tone_options, 1):
        print(f"{i}. {tone}")

    try:
        tone_choice = int(input("\nEnter the number corresponding to the tone of voice: "))
        tone_of_voice = tone_options[tone_choice - 1] if 1 <= tone_choice <= len(tone_options) else "Professional"
    except ValueError:
        tone_of_voice = "Professional"

    # Section selection at the end
    print("\nSelect the sections you want to generate (comma-separated):")
    print("1. Navigation Section")
    print("2. Hero Section")
    print("3. How It Works Section")
    print("4. Features Section")
    print("5. Testimonial Section")
    print("6. About US Section")
    print("7. Footer Section")

    section_choices = input("\nEnter the numbers corresponding to your choices (e.g., 1,2,3,4,5,6,7): ").strip()
    selected_sections = []

    if "1" in section_choices:
        selected_sections.append("navigation")
    if "2" in section_choices:
        selected_sections.append("hero")
    if "3" in section_choices:
        selected_sections.append("howitworks")
    if "4" in section_choices:
        selected_sections.append("features")
    if "5" in section_choices:
        selected_sections.append("testimonials")
    if "6" in section_choices:
        selected_sections.append("about_us")
    if "7" in section_choices:
        selected_sections.append("footer")
    

    if not selected_sections:
        print("\nInvalid choice. Please select at least one section.")
        exit()


    print("\nGenerating Content...\n")
    output_texts = generate_content(selected_sections, company_name, company_type, company_description, audience, tone_of_voice)
    
    # result=format_output(output_texts)
    print(type(output_texts),output_texts)
    print(type(output_texts), output_texts)  # Display the type and full content for debugging

    print("\nGenerated Content:")
    if isinstance(output_texts, dict):  # Ensure it's a dictionary
        for key, task_output in output_texts.items():
            if hasattr(task_output, "raw"):  # Check if 'raw' exists in the TaskOutput
                try:
                    parsed_json = json.loads(task_output.raw)  # Parse the raw string as JSON ## LANDING PAGE RESPONSE
                except json.JSONDecodeError:
                    parsed_json = {"error": "Invalid JSON format", "raw_output": task_output.raw}  # Fallback JSON structure
                print(f"\nSection: {key}")
                print(json.dumps(parsed_json, indent=4))  # Pretty print the JSON
            else:
                parsed_json = {"error": "No raw output available"}  # Fallback JSON
                print(f"\nSection: {key}")
                print(json.dumps(parsed_json, indent=4))
    else:
        print(json.dumps({"error": "Output format is not a dictionary"}, indent=4))

