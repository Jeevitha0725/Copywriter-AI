import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const FeaturesSection = ({ features, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({ features });

  const handleGenerate = async (sectionType, formData) => {
    try {
      // TODO: Implement API call to generate content
      // const response = await generateSectionContent(sectionType, formData);
      // const newContent = response.data;
      // setContent(newContent);
      // onUpdate?.(newContent);
      
      // Temporary mock data
      const mockResponse = {
        features: [
          "AI-Powered Content Generation",
          "Smart SEO Optimization",
          "Multi-language Support",
          "Real-time Analytics",
          "Custom Branding Options"
        ]
      };
      
      setContent(mockResponse);
      onUpdate?.(mockResponse);
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  return (
    <section className="py-16 bg-white relative group">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to streamline your workflow
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        sectionType="features"
        onGenerate={handleGenerate}
      />
    </section>
  );
};

export default FeaturesSection; 