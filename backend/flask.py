from flask import Flask, jsonify, request
import cw_landingpage  # Import response.py file
import requests  # Import requests to send data to our own Flask server

app = Flask(__name__)

@app.route('/landing_page', methods=['POST'])
def landing_page():
    data = request.get_json()

    # Extracting data from request
    company_name = data.get('company_name', 'Unknown')
    company_type = data.get('company_type', 'Unknown')
    company_description = data.get('company_description', 'Unknown')
    audience = data.get('target_audience', 'Unknown')
    tone_of_voice = data.get('tone_of_voice', 'Professional')
    selected_sections = data.get('selected_sections', [])

    # Pass data to cw_landingpage
    cw_landingpage.set_company_details(
        company_name, company_type, company_description, audience, tone_of_voice, selected_sections
    )

    return jsonify({"message": "Landing page details updated", "data": cw_landingpage.parsed_json})

@app.route('/landing_page', methods=['GET'])
def get_landing_page():
    return jsonify(cw_landingpage.parsed_json)  # Return the stored landing page details

if __name__ == '__main__':
    # Start Flask server in a separate thread
    from threading import Thread
    def run_flask():
        app.run(debug=True, use_reloader=False)

    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Collect company details
    company_name = input("Enter Company Name: ").strip()
    company_type = input("Enter Company Type (e.g., eCommerce, SaaS): ").strip()
    company_description = input("Enter Company Description: ").strip()
    audience = input("Enter Target Audience: ").strip()

    # Tone selection
    tone_options = ["Professional", "Casual", "Friendly", "Technical"]
    print("\nSelect Tone of Voice:")
    for i, tone in enumerate(tone_options, 1):
        print(f"{i}. {tone}")

    try:
        tone_choice = int(input("\nEnter the number corresponding to the tone of voice: "))
        tone_of_voice = tone_options[tone_choice - 1] if 1 <= tone_choice <= len(tone_options) else "Professional"
    except ValueError:
        tone_of_voice = "Professional"

    # Section selection
    print("\nSelect the sections you want to generate (comma-separated):")
    print("1. Navigation Section")
    print("2. Hero Section")
    print("3. How It Works Section")
    print("4. Features Section")
    print("5. Testimonial Section")
    print("6. About Us Section")
    print("7. Footer Section")

    section_choices = input("\nEnter the numbers corresponding to your choices (e.g., 1,2,3,4,5,6,7): ").strip()
    sections_map = {
        "1": "navigation",
        "2": "hero",
        "3": "howitworks",
        "4": "features",
        "5": "testimonials",
        "6": "about_us",
        "7": "footer",
    }
    selected_sections = [sections_map[num] for num in section_choices.split(",") if num in sections_map]

    if not selected_sections:
        print("\nInvalid choice. Please select at least one section.")
        exit()

    # Send data to the Flask route
    url = "http://127.0.0.1:5000/landing_page"
    response = requests.post(url, json={
        "company_name": company_name,
        "company_type": company_type,
        "company_description": company_description,
        "target_audience": audience,
        "tone_of_voice": tone_of_voice,
        "selected_sections": selected_sections
    })

    print(response.json())  # Print the response from Flask

    # Fetch and print the updated details
    get_response = requests.get(url)
    print("Updated Landing Page Details:", get_response.json())
