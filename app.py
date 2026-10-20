from flask import Flask, render_template, request, jsonify
import re # The built-in Regular Expression library to test text patterns

app = Flask(__name__)

# --- RULE 1: SERVE THE HOME PAGE ---
@app.route('/')
def home():
    # Looks inside your 'templates/' folder for index.html
    return render_template('index.html')


# --- RULE 2: THE CHECKER ENGINE ROUTE ---
@app.route('/check-password', methods=['POST'])
def check_password():
    # 1. Unpack the JSON package sent over by the JavaScript fetch function
    data = request.get_json()
    password = data.get('password', '')

    # 2. Establish our scoring counter and an empty feedback list
    score = 0
    feedback = [] # 🌟 FIXED: Created the missing list variable

    # Test A: Check overall character length
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("At least 8 characters long") # 🌟 FIXED: Added suggestion

    # Test B: Look for at least one capital letter
    if re.search(r"[A-Z]", password):
        score += 1
    else:
        feedback.append("At least one uppercase letter") # 🌟 FIXED: Added suggestion

    # Test C: Look for at least one lowercase letter
    if re.search(r"[a-z]", password):
        score += 1
    else:
        feedback.append("At least one lowercase letter") # 🌟 FIXED: Added suggestion

    # Test D: Look for at least one numeric digit
    if re.search(r"\d", password):
        score += 1
    else:
        feedback.append("At least one number") # 🌟 FIXED: Added suggestion

    # Test E: Look for symbols / special characters
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    else:
        feedback.append("At least one special character") # 🌟 FIXED: Added suggestion

    # 3. Calculate rating text based on the total matched score points
    if score <= 2:
        strength_rating = "Weak"
    elif score <= 4:
        strength_rating = "Medium"
    else:
        strength_rating = "Strong"

    # 4. Zip the results up into a clean JSON package and send it back to JavaScript
    # 🌟 FIXED: Fixed the line indentation format spacing here
    return jsonify({
        "strength": strength_rating,
        "score": score,
        "feedback": feedback   
    })


if __name__ == '__main__':
    # Starts your local development environment server engine
    app.run(debug=True)
