import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GenerateResume = () => {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState('');
  const [applicantDetails, setApplicantDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const resumeRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobUrl || !applicantDetails) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/resume', {
        jobUrl,
        applicantDetails
      });
      
      if (response.data.success) {
        setResumeData(response.data.resume);
        toast.success('Resume generated successfully!');
      } else {
        toast.error(response.data.error || 'Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Error connecting to the resume service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!resumeRef.current) return;
    
    setPdfLoading(true);
    try {
      toast.info('Generating PDF, please wait...');
      
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20; // Left margin
      const contentWidth = pageWidth - (margin * 2);
      
      // Header - Name
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(resumeData.name, margin, 30);
      
      // Professional Title
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(resumeData.professionalTitle.toUpperCase(), margin, 40);
      
      // Contact Info on same line
      pdf.setFontSize(10);
      const contactText = `${resumeData.contact.location} | ${resumeData.contact.phone} | ${resumeData.contact.email}`;
      pdf.text(contactText, margin, 48);
      
      let yPos = 60;
      
      // Function to add section title with underline
      const addSectionTitle = (title, y) => {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(title, margin, y);
        
        // Add underline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y + 3, pageWidth - margin, y + 3);
        
        return y + 12; // Return new y position after title
      };
      
      // Objective section
      if (resumeData.objective) {
        yPos = addSectionTitle("Objective", yPos);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const splitObjective = pdf.splitTextToSize(resumeData.objective, contentWidth);
        pdf.text(splitObjective, margin, yPos);
        
        yPos += (splitObjective.length * 5) + 5;
      }
      
      // Experience section
      if (resumeData.experience && resumeData.experience.length > 0) {
        yPos = addSectionTitle("Experience", yPos);
        
        resumeData.experience.forEach((exp) => {
          // Check if we need a new page
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          // Company and position
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'bold');
          pdf.text(`${exp.company} | ${exp.title}`, margin, yPos);
          
          // Date on the right
          const dateWidth = pdf.getStringUnitWidth(exp.dates) * 10 / pdf.internal.scaleFactor;
          pdf.setFont(undefined, 'normal');
          pdf.text(exp.dates, pageWidth - margin - dateWidth, yPos);
          
          yPos += 6;
          
          // Description bullet points
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          
          exp.description.forEach((item) => {
            // Check if we need a new page
            if (yPos > 275) {
              pdf.addPage();
              yPos = 20;
            }
            
            const bulletText = `• ${item}`;
            const splitItem = pdf.splitTextToSize(bulletText, contentWidth - 5);
            pdf.text(splitItem, margin + 3, yPos);
            yPos += splitItem.length * 5;
          });
          
          yPos += 6; // Add space between experiences
        });
      }
      
      // Education section
      if (resumeData.education && resumeData.education.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        yPos = addSectionTitle("Education", yPos);
        
        resumeData.education.forEach((edu) => {
          // Check if we need a new page
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          // Institution and degree
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'bold');
          pdf.text(`${edu.institution}, ${edu.degree}`, margin, yPos);
          
          // Date on the right
          const dateWidth = pdf.getStringUnitWidth(edu.dates) * 10 / pdf.internal.scaleFactor;
          pdf.setFont(undefined, 'normal');
          pdf.text(edu.dates, pageWidth - margin - dateWidth, yPos);
          
          yPos += 6;
          
          // Major and minor - ensure font is set to normal
          if (edu.details) {
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal'); // Explicitly set to normal font
            pdf.text(edu.details, margin, yPos);
            yPos += 6;
          }
          
          yPos += 6; // Add space between education entries
        });
      }
      
      // Skills section
      if (resumeData.skills && resumeData.skills.length > 0) {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        yPos = addSectionTitle("Skills & abilities", yPos);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        // Format skills as bullet points
        let currentY = yPos;
        let columnWidth = contentWidth / 2;
        let columnCount = 0;
        
        resumeData.skills.forEach((skill, index) => {
          // Determine if we need to wrap to next column or page
          if (currentY > 270 && columnCount === 0) {
            // Move to next column
            currentY = yPos;
            columnCount = 1;
          } else if (currentY > 270 && columnCount === 1) {
            // Move to next page
            pdf.addPage();
            currentY = 20;
            columnCount = 0;
          }
          
          const bulletText = `• ${skill}`;
          pdf.text(bulletText, margin + (columnCount * columnWidth), currentY);
          currentY += 5;
        });
        
        yPos = Math.max(yPos + 10, currentY + 10);
      }
      
      // Generate a filename using the person's name and current date
      const fileName = `${resumeData.name.replace(/\s+/g, '_')}_Resume_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">AI Resume Generator</h1>
          
          {!resumeData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="Enter the URL of the job posting"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Professional Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicantDetails}
                  onChange={(e) => setApplicantDetails(e.target.value)}
                  placeholder="Enter your skills, experience, education, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                  required
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/getStarted')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Resume'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div ref={resumeRef} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Generated Resume</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{resumeData.name}</h3>
                  <p className="text-gray-700">{resumeData.professionalTitle}</p>
                  <div className="mt-2">
                    <p className="text-gray-700">📍 {resumeData.contact.location}</p>
                    <p className="text-gray-700">📱 {resumeData.contact.phone}</p>
                    <p className="text-gray-700">📧 {resumeData.contact.email}</p>
                  </div>
                </div>
                
                {resumeData.objective && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                    <p className="text-gray-700">{resumeData.objective}</p>
                  </div>
                )}
                
                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Key Skills</h3>
                    <ul className="list-disc pl-5">
                      {resumeData.skills.map((skill, index) => (
                        <li key={index} className="text-gray-700">{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Experience</h3>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index}>
                          <h4 className="font-medium">{exp.title} at {exp.company}</h4>
                          <p className="text-sm text-gray-600">{exp.dates}</p>
                          <ul className="list-disc pl-5 mt-2">
                            {exp.description.map((item, i) => (
                              <li key={i} className="text-gray-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {resumeData.education && resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-gray-600">{edu.institution} | {edu.dates}</p>
                          <p className="text-gray-700 mt-1">{edu.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setResumeData(null)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Create Another Resume
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={generatePDF}
                    disabled={pdfLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                  >
                    {pdfLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Download PDF</>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate('/interview')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Prepare for Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateResume; 