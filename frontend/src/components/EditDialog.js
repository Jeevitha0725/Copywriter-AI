import React, { useState } from 'react';
import axios from 'axios';

const EditDialog = ({ isOpen, onClose, sectionType, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'professional',
    targetAudience: '',
    companyName: '',
    companyDescription: '',
    companyType: '',
    productName: '',
    productDescription: '',
    creativity: 'Normal'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      // Generate content based on section type
      const response = await generateContent(sectionType, formData);
      
      // Format the content based on section type
      const formattedContent = formatContent(sectionType, response.data);
      
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
      return response;
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

    // Map form data to API endpoint requirements
    switch (sectionType) {
      case 'hero':
        return {
          ...baseConfig,
          url: 'http://127.0.0.1:5000/hero',
          data: {
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            company_type: formData.companyType,
            target_audience: formData.targetAudience || "Designer",
            creativity: formData.creativity || 'Normal',
            tone_of_voice: formData.tone
          }
        };

      case 'about':
        return {
          ...baseConfig,
          url: 'http://127.0.0.1:5000/aboutus_tool',
          data: {
            product_name: formData.productName,
            product_description: formData.productDescription,
            target_audience: formData.targetAudience || "Designer",
            creativity: formData.creativity || 'Normal',
            tone_of_voice: formData.tone
          }
        };

      case 'features':
        return {
          ...baseConfig,
          url: 'http://127.0.0.1:5000/features',
          data: {
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            product_name: formData.productName,
            product_description: formData.productDescription,
            target_audience: formData.targetAudience || "Designer",
            creativity: formData.creativity || 'Normal',
            tone_of_voice: formData.tone
          }
        };

      case 'testimonials':
        return {
          ...baseConfig,
          url: 'http://127.0.0.1:5000/testimonial',
          data: {
            product_name: formData.productName,
            product_description: formData.productDescription,
            target_audience: formData.targetAudience || "Designer",
            creativity: formData.creativity || 'Normal',
            tone_of_voice: formData.tone
          }
        };

      case 'howItWorks':
        return {
          ...baseConfig,
          url: 'http://127.0.0.1:5000/howitworks',
          data: {
            product_name: formData.productName,
            product_description: formData.productDescription,
            target_audience: formData.targetAudience || "Designer",
            creativity: formData.creativity || 'Normal',
            tone_of_voice: formData.tone
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
          title: content.title || content.headline,
          description: content.description
        };
      case 'about':
        return {
          title: content.title,
          description: content.description
        };
      case 'features':
        return {
          features: content.features || []
        };
      case 'testimonials':
        return {
          title: content.title,
          description: content.description,
          testimonialLists: content.testimonialLists || []
        };
      case 'howItWorks':
        return {
          title: content.title,
          description: content.description,
          services: content.services || []
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
          companyName: true,
          companyDescription: true,
          companyType: true,
          targetAudience: true,
          tone: true,
          creativity: true
        };
      case 'about':
        return {
          productName: true,
          productDescription: true,
          targetAudience: true,
          tone: true,
          creativity: true
        };
      case 'features':
        return {
          companyName: true,
          companyDescription: true,
          productName: true,
          productDescription: true,
          targetAudience: true,
          tone: true,
          creativity: true
        };
      case 'testimonials':
        return {
          productName: true,
          productDescription: true,
          targetAudience: true,
          tone: true,
          creativity: true
        };
      case 'howItWorks':
        return {
          productName: true,
          productDescription: true,
          targetAudience: true,
          tone: true,
          creativity: true
        };
      default:
        return {
          prompt: true,
          tone: true,
          creativity: true
        };
    }
  };

  // Update the form JSX to conditionally render fields
  const renderFormFields = () => {
    const fields = getSectionFormFields();
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name field */}
        {fields.companyName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
              required
            />
          </div>
        )}

        {/* Company Description field */}
        {fields.companyDescription && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
              rows={3}
              required
            />
          </div>
        )}

        {/* Company Type field */}
        {fields.companyType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Type
            </label>
            <input
              type="text"
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
              placeholder="e.g., SaaS, eCommerce"
              required
            />
          </div>
        )}

        {/* Product Name field */}
        {fields.productName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
              required
            />
          </div>
        )}

        {/* Product Description field */}
        {fields.productDescription && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
              rows={3}
              required
            />
          </div>
        )}

        {/* Tone field is always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {/* Creativity field */}
        {fields.creativity && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Creativity Level
            </label>
            <select
              name="creativity"
              value={formData.creativity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>
        )}

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