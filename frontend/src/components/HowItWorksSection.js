import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const HowItWorksSection = ({ title, description, services, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({ title, description, services });

  const handleEdit = (key, value) => {
    const newContent = {
      ...content,
      [key]: value
    };
    setContent(newContent);
    onUpdate?.(newContent);
  };

  const handleGenerate = async (sectionType, generatedContent) => {
    try {
      setContent(generatedContent);
      onUpdate?.(generatedContent);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return (
    <section className="py-16 bg-gray-50 relative group">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            {content.description}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.services.map((service, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <svg
                      className="h-6 w-6"
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
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        sectionType="howItWorks"
        onGenerate={handleGenerate}
      />
    </section>
  );
};

export default HowItWorksSection;