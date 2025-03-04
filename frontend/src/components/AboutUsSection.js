import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const AboutUsSection = ({ title, description, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({ title, description });

  const handleGenerate = async (sectionType, formData) => {
    try {
      // TODO: Implement API call to generate content
      // const response = await generateSectionContent(sectionType, formData);
      // const newContent = response.data;
      // setContent(newContent);
      // onUpdate?.(newContent);
      
      // Temporary mock data
      const mockResponse = {
        title: "About Our Company",
        description: "We are a team of passionate innovators dedicated to transforming businesses through cutting-edge technology solutions. Our mission is to empower organizations with the tools they need to thrive in the digital age."
      };
      
      setContent(mockResponse);
      onUpdate?.(mockResponse);
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-indigo-50 overflow-hidden group">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
            {content.title}
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-8 rounded-lg shadow-xl">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-6">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To empower businesses with innovative solutions that drive growth and success.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-8 rounded-lg shadow-xl">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-6">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To be the leading provider of innovative business solutions worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        sectionType="about"
        onGenerate={handleGenerate}
      />
    </section>
  );
};

export default AboutUsSection;
