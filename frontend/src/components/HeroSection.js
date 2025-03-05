import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const HeroSection = ({ title, description, onUpdate }) => {
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
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden group">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              {content.title}
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              {content.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-base font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        sectionType="hero"
        onGenerate={handleGenerate}
      />
    </section>
  );
};

export default HeroSection;
