import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const AboutUsSection = ({ title, description, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({ title, description });

  const handleGenerate = async (sectionType, generatedContent) => {
    try {
      // Update local state with the generated content
      setContent(generatedContent);
      
      // Notify parent component of the update
      if (onUpdate) {
        onUpdate(generatedContent);
      }
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return (
    <section className="py-16 bg-white">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {content.title}
          </h2>
          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-xl text-gray-500">
              {content.description}
            </p>
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
