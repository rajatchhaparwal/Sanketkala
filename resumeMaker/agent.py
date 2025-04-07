from pydantic_ai import Agent, RunContext
from dataclasses import dataclass
from typing import List, Dict, Any
import requests
import time
import json
import sys

@dataclass
class ContactInfo:
    """Represents the contact information."""
    location: str
    phone: str
    email: str

@dataclass
class ExperienceItem:
    """Represents a single work experience entry."""
    company: str
    title: str
    dates: str
    description: List[str]

@dataclass
class EducationItem:
    """Represents a single education entry."""
    institution: str
    degree: str
    dates: str
    details: str # Assuming 'details' is always a string based on the example

@dataclass
class Resume:
    """Represents the entire resume data structure."""
    name: str
    professionalTitle: str # Matches the JSON key casing
    contact: ContactInfo
    objective: str
    experience: List[ExperienceItem]
    education: List[EducationItem]
    skills: List[str]


def job_desc(url: str) -> Dict[str, Any]:
    """
    Extract job description from a URL using BrightData API.
    
    Args:
        url: The job posting URL to extract data from
        
    Returns:
        Dictionary containing the job description and details
        
    Raises:
        Exception: If there is an error with the API request or processing
    """
    try:
        # First API call to trigger data extraction
        url1 = "https://api.brightdata.com/datasets/v3/trigger"
        headers = {
            "Authorization": "Bearer f2b26535234ee1fc79a51e7dad707c5633174f6cd071f50ff857844b28d52f21",
            "Content-Type": "application/json",
        }
        params = {
            "dataset_id": "gd_lpfll7v5hcqtkxl6l",
            "include_errors": "true",
        }
        data = [
            {"url": url}
        ]

        response = requests.post(url1, headers=headers, params=params, json=data)
        response_data = response.json()
        
        if 'error' in response_data:
            raise Exception(f"BrightData API error: {response_data['error']}")
        
        if 'snapshot_id' not in response_data:
            raise Exception("No snapshot ID returned from BrightData API")
            
        snapshot_id = response_data['snapshot_id']
        print(f"Job extraction initiated. Snapshot ID: {snapshot_id}")

        # Wait for processing to complete
        print("Waiting 60 seconds for processing...")
        time.sleep(60)

        # Second API call to retrieve the processed data
        url2 = f"https://api.brightdata.com/datasets/v3/snapshot/{snapshot_id}"
        headers = {
            "Authorization": "Bearer f2b26535234ee1fc79a51e7dad707c5633174f6cd071f50ff857844b28d52f21",
        }
        params = {
            "format": "json",
        }

        response = requests.get(url2, headers=headers, params=params)
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            return result[0]  # Return the first job description
        else:
            raise Exception("No job data returned or invalid format")
            
    except requests.RequestException as e:
        raise Exception(f"Network error: {str(e)}")
    except ValueError as e:
        raise Exception(f"JSON parsing error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error extracting job description: {str(e)}")

# Initialize AI agents
resume_agent = Agent("google-gla:gemini-2.5-pro-exp-03-25",
              deps_type=str,
              result_type = Resume,
              system_prompt=("""you are a professional who creates the best resume for a given job description you are provided
                                you will be given a job description and you will need to create a resume that is ATS friendly and will get you the interview
                                you will also be given a list of keywords that are important to the job description you may include in the resume according to the qulification of the applicant
                                you will also be provided with the qualifications of the applicant and you have to make resume according to the qualifications of the applicant
                                make sure not to exceed the 500 word limit
                             
                                Examples that quantify impact
                                Good example
                                Achieved 40% product revenue growth in three months by planning and launching four new key features.
                                Improved state test pass rates from 78% to 87% in two years.
                                Bad examples
                                Created a conducive learning environment.
                                Responsible for preparing financial reports including budget performance.
                                here are the most important tips for creating an ATS-friendly resume:
                                Choose the Right Format: Prioritize Chronological or Combination resume formats. Avoid the Functional format as ATS systems often struggle to parse it correctly due to the lack of clear chronological work history.
                                Use Standard, Readable Fonts: Stick to widely recognized fonts like Arial, Calibri, Helvetica, Times New Roman, Georgia, or Verdana. Avoid script, decorative, custom, or overly narrow/light fonts. Use a font size between 10-12 points for the body text.
                                Optimize with Keywords: Carefully analyze the job description to identify relevant keywords (skills, qualifications, job titles, industry jargon). Incorporate these keywords naturally throughout your resume, especially in the summary, work experience, and skills sections. Use the exact phrasing from the job description where possible, including both full terms and acronyms (e.g., "Customer Relationship Management (CRM)").
                                Avoid Keyword Stuffing: While keywords are crucial, do not overuse them unnaturally. Integrate them contextually within your achievements and responsibilities.
                                Keep Formatting Simple:
                                Avoid graphics, images, logos, charts, and text boxes, as ATS often cannot read them.
                                Use standard bullet points (like black dots or squares).
                                Use bolding and italics sparingly for emphasis.
                                Avoid complex tables; use simple layouts or bullet points instead.
                                Ensure adequate white space and standard margins (e.g., 1-inch).
                                Use Standard Section Headings: Employ conventional headings like "Work Experience," "Education," and "Skills" so the ATS can easily categorize the information.
                                Place Information Correctly: Do not put essential information like contact details in the header or footer, as many ATS systems skip these sections. Keep all vital information within the main body of the resume.
                                Use Consistent Date Formatting: Choose one format (e.g., MM/YYYY or Month Year) and use it consistently for all dates (education, work experience). Include both month and year.
                                Repetition Using the same words over and over again in your resume can be perceived as a sign of poor language understanding.
                                Instead, use synonyms and active verbs that increase the impact of your achievements.
                                Spelling & Grammar Having an error-free resume is key to making a good first impression on the hiring manager. Ensure that your resume is free from spelling and grammatical errors by reading it aloud a few times.
                                For an extra layer of security, use the Enhancv resume builder and let the content checker do the heavy lifting for you.
                                Resume Length The length of your resume should be based on the relevant experience you have for a job, the number of years of experience, and the job you’re applying for.
                                For 95% of applicants, a one-page resume is more than enough to communicate relevant information to the hiring manager. For positions in the medical world, expanding the length to accommodate all experiences can be beneficial.
                                Using bullet points to communicate experience and achievements on your resume is a sure way to grab the hiring manager’s attention. Bullet points improve the structure of your resume and make your point easily.
                                That’s why bullet point length is crucial for a good resume. Using no more than 50 words is a must if you want to make your resume easy to read
                                Email Address Emails are important in today’s world. It’s one of the go-to ways for recruiters to get in touch with you, especially if you’re applying for a job that’s remote and in another country.
                                Active voice Using active voice in your resume can help you fit more information into a single page as active voice tends to be shorter than passive voice sentences.
                                Buzzwords & Cliches Using buzzwords and jargon in your resume is a sure-fire way to lose the interest of recruiters quickly.
                                Buzzwords make information that should be easily understandable unclear."""),

                            )

keyword_agent = Agent("google-gla:gemini-2.5-pro-exp-03-25",
                deps_type = str,
                result_type = str,
                system_prompt = ("""you are a professional who creates the best keywords to include in a ATS friendly resume you are provided""")
                )

def generate_resume(job_url: str, applicant_details: str) -> Dict[str, Any]:
    """
    Generate a resume based on job URL and applicant details.
    
    Args:
        job_url: URL of the job posting
        applicant_details: Details of the applicant
        
    Returns:
        Dictionary containing the formatted resume
    """
    try:
        # Get job description
        job_details = job_desc(job_url)
        
        # Generate keywords
        print("Generating keywords...")
        keywords = keyword_agent.run_sync(f"find the best keywords for this job {job_details}", deps="").data
        print("Keywords generated successfully")
        
        # Generate resume
        print("Generating resume...")
        output = resume_agent.run_sync(
            f"create a ATS friendly resume here is the qualifictions of applicant {applicant_details} and this is the job description {job_details} and here is the keywords {keywords}"
        )
        print("Resume generated successfully")
        
        # Convert Resume object to a dictionary
        resume_dict = {
            "name": output.data.name,
            "professionalTitle": output.data.professionalTitle,
            "contact": {
                "location": output.data.contact.location,
                "phone": output.data.contact.phone,
                "email": output.data.contact.email
            },
            "objective": output.data.objective,
            "experience": [
                {
                    "company": exp.company,
                    "title": exp.title,
                    "dates": exp.dates,
                    "description": exp.description
                } for exp in output.data.experience
            ],
            "education": [
                {
                    "institution": edu.institution,
                    "degree": edu.degree,
                    "dates": edu.dates,
                    "details": edu.details
                } for edu in output.data.education
            ],
            "skills": output.data.skills
        }
        
        return resume_dict
        
    except Exception as e:
        print(f"Error in generate_resume: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        print("Starting resume generation...")
        
        # Only run this section when executed directly
        keywords = keyword_agent.run_sync(f"find the best keywords for this job {job_details}", deps="").data
        print(keywords)

        output = resume_agent.run_sync(f"create a ATS friendly resume here is the qualifictions of applicant {applicant_details} and this is the job description {job_details} and here is the keywords {keywords}"+""""here are the most important tips for creating an ATS-friendly resume:
                                                                Achieved 40% product revenue growth in three months by planning and launching four new key features.
                                Improved state test pass rates from 78% to 87% in two years.
                                Bad examples
                                Created a conducive learning environment.
                                Responsible for preparing financial reports including budget performance.
                                Choose the Right Format: Prioritize Chronological or Combination resume formats. Avoid the Functional format as ATS systems often struggle to parse it correctly due to the lack of clear chronological work history.
                                Use Standard, Readable Fonts: Stick to widely recognized fonts like Arial, Calibri, Helvetica, Times New Roman, Georgia, or Verdana. Avoid script, decorative, custom, or overly narrow/light fonts. Use a font size between 10-12 points for the body text.
                                Optimize with Keywords: Carefully analyze the job description to identify relevant keywords (skills, qualifications, job titles, industry jargon). Incorporate these keywords naturally throughout your resume, especially in the summary, work experience, and skills sections. Use the exact phrasing from the job description where possible, including both full terms and acronyms (e.g., "Customer Relationship Management (CRM)").
                                Avoid Keyword Stuffing: While keywords are crucial, do not overuse them unnaturally. Integrate them contextually within your achievements and responsibilities.
                                Keep Formatting Simple:
                                Avoid graphics, images, logos, charts, and text boxes, as ATS often cannot read them.
                                Use standard bullet points (like black dots or squares).
                                Use bolding and italics sparingly for emphasis.
                                Avoid complex tables; use simple layouts or bullet points instead.
                                Ensure adequate white space and standard margins (e.g., 1-inch).
                                Use Standard Section Headings: Employ conventional headings like "Work Experience," "Education," and "Skills" so the ATS can easily categorize the information.
                                Place Information Correctly: Do not put essential information like contact details in the header or footer, as many ATS systems skip these sections. Keep all vital information within the main body of the resume.
                                Use Consistent Date Formatting: Choose one format (e.g., MM/YYYY or Month Year) and use it consistently for all dates (education, work experience). Include both month and year.
                                Repetition Using the same words over and over again in your resume can be perceived as a sign of poor language understanding.
                                Instead, use synonyms and active verbs that increase the impact of your achievements.
                                Spelling & Grammar Having an error-free resume is key to making a good first impression on the hiring manager. Ensure that your resume is free from spelling and grammatical errors by reading it aloud a few times.
                                For an extra layer of security, use the Enhancv resume builder and let the content checker do the heavy lifting for you.
                                Resume Length The length of your resume should be based on the relevant experience you have for a job, the number of years of experience, and the job you’re applying for.
                                For 95% of applicants, a one-page resume is more than enough to communicate relevant information to the hiring manager. For positions in the medical world, expanding the length to accommodate all experiences can be beneficial.
                                Using bullet points to communicate experience and achievements on your resume is a sure way to grab the hiring manager’s attention. Bullet points improve the structure of your resume and make your point easily.
                                That’s why bullet point length is crucial for a good resume. Using no more than 50 words is a must if you want to make your resume easy to read
                                Email Address Emails are important in today’s world. It’s one of the go-to ways for recruiters to get in touch with you, especially if you’re applying for a job that’s remote and in another country.
                                Active voice Using active voice in your resume can help you fit more information into a single page as active voice tends to be shorter than passive voice sentences.
                                Buzzwords & Cliches Using buzzwords and jargon in your resume is a sure-fire way to lose the interest of recruiters quickly.
                                Buzzwords make information that should be easily understandable unclear.""")
        print(output.data)

        # Convert Resume object to a dictionary and save as JSON
        resume_dict = {
            "name": output.data.name,
            "professionalTitle": output.data.professionalTitle,
            "contact": {
                "location": output.data.contact.location,
                "phone": output.data.contact.phone,
                "email": output.data.contact.email
            },
            "objective": output.data.objective,
            "experience": [
                {
                    "company": exp.company,
                    "title": exp.title,
                    "dates": exp.dates,
                    "description": exp.description
                } for exp in output.data.experience
            ],
            "education": [
                {
                    "institution": edu.institution,
                    "degree": edu.degree,
                    "dates": edu.dates,
                    "details": edu.details
                } for edu in output.data.education
            ],
            "skills": output.data.skills
        }

        # Save to a JSON file
        with open('resume.json', 'w') as f:
            json.dump(resume_dict, f, indent=4)
            
        print("Resume saved to resume.json")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)