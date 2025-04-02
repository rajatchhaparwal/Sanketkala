import React from "react";

export default function ResumeTemplate({ 
  name = "John Doe", 
  email = "johndoe@example.com", 
  phone = "123-456-7890", 
  linkedin = "#", 
  summary = "A skilled professional seeking new opportunities.", 
  experience1 = {}, 
  experience2 = {}, 
  education1 = {}, 
  education2 = {}, 
  skill1 = "Skill 1", 
  skill2 = "Skill 2", 
  skill3 = "Skill 3" 
}) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-10 border-gray-300">
      <h1 className="text-3xl font-bold text-center mb-4">{name}</h1>
      <p className="text-center text-gray-600">
        {email} | {phone} | <a href={linkedin} className="text-blue-500">LinkedIn</a>
      </p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-1">Summary</h2>
        <p className="text-gray-700 mt-2">{summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-1">Experience</h2>
        <div className="mt-3">
          <h3 className="font-semibold">{experience1?.position || "Position"} - {experience1?.company || "Company"}</h3>
          <p className="text-sm text-gray-500">{experience1?.duration || "Duration"}</p>
          <p className="text-gray-700">{experience1?.description || "Job description goes here."}</p>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold">{experience2?.position || "Position"} - {experience2?.company || "Company"}</h3>
          <p className="text-sm text-gray-500">{experience2?.duration || "Duration"}</p>
          <p className="text-gray-700">{experience2?.description || "Job description goes here."}</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-1">Education</h2>
        <div className="mt-3">
          <h3 className="font-semibold">{education1?.degree || "Degree"} - {education1?.institution || "Institution"}</h3>
          <p className="text-sm text-gray-500">{education1?.year || "Year"}</p>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold">{education2?.degree || "Degree"} - {education2?.institution || "Institution"}</h3>
          <p className="text-sm text-gray-500">{education2?.year || "Year"}</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-1">Skills</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>{skill1}</li>
          <li>{skill2}</li>
          <li>{skill3}</li>
        </ul>
      </section>
    </div>
  );
}
