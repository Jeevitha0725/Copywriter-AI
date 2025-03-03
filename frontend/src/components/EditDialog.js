import React, { useState } from 'react';
import axios from 'axios';

const EditDialog = ({ isOpen, onClose, sectionType, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'professional',
    targetAudience: '',
    keywords: '',
    length: 'medium'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      // Generate content based on section type
      const generatedContent = await generateContent(sectionType, formData);
      
      // Format the content based on section type
      const formattedContent = formatContent(sectionType, generatedContent);
      
      // Pass the formatted content to the parent component
      await onGenerate(sectionType, formattedContent);
      onClose();
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Replace the generateContent function with this updated version
  const generateContent = async (sectionType, formData) => {
    try {
      const apiConfig = getApiConfig(sectionType, formData);
      const response = await axios(apiConfig);
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  // Add this new function to handle API configurations
  const getApiConfig = (sectionType, formData) => {
    const baseConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    switch (sectionType) {
      case 'hero':
        return {
          ...baseConfig,
          url: '/api/generate-hero',
          data: {
            prompt: formData.prompt,
            tone: formData.tone,
            targetAudience: formData.targetAudience,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            length: formData.length
          }
        };

      case 'about':
        return {
          ...baseConfig,
          url: '/api/generate-about',
          data: {
            prompt: formData.prompt,
            tone: formData.tone,
            companyType: formData.targetAudience,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            length: formData.length
          }
        };

      case 'features':
        return {
          ...baseConfig,
          url: '/api/generate-features',
          data: {
            prompt: formData.prompt,
            tone: formData.tone,
            productType: formData.targetAudience,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            length: formData.length
          }
        };

      case 'testimonials':
        return {
          ...baseConfig,
          url: '/api/generate-testimonials',
          data: {
            prompt: formData.prompt,
            tone: formData.tone,
            customerType: formData.targetAudience,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            length: formData.length,
            numberOfTestimonials: formData.length === 'short' ? 2 : formData.length === 'medium' ? 3 : 4
          }
        };

      case 'howItWorks':
        return {
          ...baseConfig,
          url: '/api/generate-how-it-works',
          data: {
            prompt: formData.prompt,
            tone: formData.tone,
            serviceType: formData.targetAudience,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            length: formData.length,
            numberOfSteps: formData.length === 'short' ? 3 : formData.length === 'medium' ? 4 : 5
          }
        };

      default:
        throw new Error('Invalid section type');
    }
  };

  // Format the generated content based on section type
  const formatContent = (sectionType, content) => {
    switch (sectionType) {
      case 'hero':
        return {
          title: content.title,
          description: content.description
        };
      case 'about':
        return {
          title: content.title,
          description: content.description
        };
      case 'features':
        return {
          features: content.features
        };
      case 'testimonials':
        return {
          title: content.title,
          description: content.description,
          testimonialLists: content.testimonialLists
        };
      case 'howItWorks':
        return {
          title: content.title,
          description: content.description,
          services: content.services
        };
      default:
        return content;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSectionFields = () => {
    switch (sectionType) {
      case 'hero':
        return {
          title: 'Hero Section Generator',
          description: 'Generate compelling hero section content including title and description'
        };
      case 'about':
        return {
          title: 'About Section Generator',
          description: 'Generate engaging about section content including company mission and vision'
        };
      case 'features':
        return {
          title: 'Features Section Generator',
          description: 'Generate feature highlights and benefits for your product or service'
        };
      case 'testimonials':
        return {
          title: 'Testimonials Generator',
          description: 'Generate authentic customer testimonials and reviews'
        };
      case 'howItWorks':
        return {
          title: 'How It Works Generator',
          description: 'Generate step-by-step process explanations and service descriptions'
        };
      default:
        return {
          title: 'Content Generator',
          description: 'Generate content for this section'
        };
    }
  };

  const sectionInfo = getSectionFields();

  // Add this new function to get section-specific form fields
  const getSectionFormFields = () => {
    switch (sectionType) {
      case 'hero':
        return {
          prompt: true,
          tone: true,
          targetAudience: true,
          keywords: true,
          length: true
        };
      case 'about':
        return {
          prompt: true,
          tone: true,
          keywords: true,
          length: true
        };
      case 'features':
        return {
          prompt: true,
          tone: true,
          productType: true,
          keywords: true,
          length: true
        };
      case 'testimonials':
        return {
          prompt: true,
          tone: true,
          customerType: true,
          keywords: true,
          length: true
        };
      case 'howItWorks':
        return {
          prompt: true,
          tone: true,
          serviceType: true,
          keywords: true,
          length: true
        };
      default:
        return {
          prompt: true,
          tone: true,
          keywords: true,
          length: true
        };
    }
  };

  // Update the form JSX to conditionally render fields
  const renderFormFields = () => {
    const fields = getSectionFormFields();
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt field is always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What would you like to generate?
          </label>
          <textarea
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Describe what kind of content you want to generate..."
            required
          />
        </div>

        {/* Tone field is always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {/* Target Audience field - shown for hero section */}
        {fields.targetAudience && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Small business owners, Tech professionals"
            />
          </div>
        )}

        {/* Product Type field - shown for features section */}
        {fields.productType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., SaaS, Mobile App, Hardware"
            />
          </div>
        )}

        {/* Customer Type field - shown for testimonials section */}
        {fields.customerType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., B2B, B2C, Enterprise"
            />
          </div>
        )}

        {/* Service Type field - shown for how it works section */}
        {fields.serviceType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Consulting, Subscription, One-time"
            />
          </div>
        )}

        {/* Keywords field - shown for all sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., innovation, technology, solutions"
          />
        </div>

        {/* Length field - shown for all sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Length
          </label>
          <select
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md text-white font-medium
              ${isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              } transition-colors duration-200`}
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">{sectionInfo.title}</h3>
          <button 
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">{sectionInfo.description}</p>

        {renderFormFields()}
      </div>
    </div>
  );
};

export default EditDialog; 