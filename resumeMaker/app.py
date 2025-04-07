from flask import Flask, render_template, request, jsonify
from agent import generate_resume

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_resume', methods=['POST'])
def generate_resume_route():
    data = request.json
    job_url = data.get('job_url')
    applicant_details = data.get('applicant_details')
    
    try:
        # Use the generate_resume function from agent.py
        resume_dict = generate_resume(job_url, applicant_details)
        return jsonify({"success": True, "resume": resume_dict})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True) 