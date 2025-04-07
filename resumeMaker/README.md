# Resume Maker

A web application that generates ATS-friendly resumes based on job descriptions and applicant details. The application uses AI to create customized resumes optimized for specific job postings.

## Features

- Submit job posting URL and applicant details
- AI-powered resume generation optimized for Applicant Tracking Systems (ATS)
- Print-ready resume output
- Mobile-friendly interface
- Keyword extraction from job descriptions
- Resume customization based on applicant qualifications

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask web server:

```bash
python run.py
```

2. Open your web browser and navigate to:

```
http://127.0.0.1:5000/
```

3. Enter a job posting URL and your qualifications/details in the form
4. Click "Generate Resume" to create your customized resume
5. Use the "Print Resume" button to print or save as PDF

## Application Structure

- `app.py` - Flask web application server
- `agent.py` - AI agent for resume generation
- `run.py` - Startup script
- `templates/index.html` - Main web interface
- `requirements.txt` - Python dependencies

## How It Works

1. The user enters a job posting URL and their qualifications
2. The application extracts the job description from the URL using BrightData API
3. An AI agent extracts relevant keywords from the job description
4. Another AI agent generates a resume optimized for the job, using the keywords and applicant details
5. The resume is displayed in a clean, printable format
6. The user can print or save the resume as a PDF

## Requirements

- Python 3.6+
- Flask
- Requests
- Pydantic-AI

## Notes

- Resume generation may take 1-2 minutes depending on the complexity
- Internet connection required for job description extraction
- The application uses the BrightData API to extract job details, which requires an API key

## Example

For testing purposes, you can use sample job URLs from platforms like LinkedIn, Indeed, or Glassdoor. Enter your qualifications in the text area provided, including experience, education, and skills. 