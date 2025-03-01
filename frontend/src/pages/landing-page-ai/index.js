import React, { useState } from 'react';
import Layout from "@/components/Layout";

const Index = () => {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    language: 'English (US)',
    toneOfVoice: 'Professional',
    companyName: '',
    companyType: '',
    audience: '',
    mainColor: 'blue',
    companyDescription: ''
  });

  const [selectedSections, setSelectedSections] = useState([
    { id: 'content', label: 'Content' },
    { id: 'cta', label: 'Calls to action (Start Free Trial, Sign Up,...)' }
  ]);

  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const availableSections = [
    { id: 'navigation', label: 'Navigation/Menu' },
    { id: 'hero', label: 'Hero Section/Header' },
    { id: 'logos', label: 'Logos (Trusted by, Some of your customers,...)' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'blog', label: 'Recent Blog Posts' },
    { id: 'faq', label: 'FAQ (Frequently Asked Questions)' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'content', label: 'Content' },
    { id: 'statistics', label: 'Statistics (Number of Users, Satisfied Customers,...)' },
    { id: 'cta', label: 'Calls to action (Start Free Trial, Sign Up,...)' },
    { id: 'about', label: 'About us' },
    { id: 'footer', label: 'Footer' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'companyDescription') {
      setCharacterCount(value.length);
    }
  };

  const handleSectionSelect = (sectionId) => {
    if (!sectionId) return;
    
    if (selectedSections.some(s => s.id === sectionId)) {
      setSelectedSections(prev => prev.filter(s => s.id !== sectionId));
    } else {
      setSelectedSections(prev => [...prev, { id: sectionId, label: sectionId }]);
    }
  };

  const handleCreatePage = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      const response = {
        headerSection: {
          logo: formData.companyName,
          links: ["Home", "About Us", "Services", "Contact"],
        },
        heroSection: {
          title: `Transform Your ${formData.companyType} with ${formData.companyName}`,
          description: formData.companyDescription,
        },
        // Add other sections based on selectedSections
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowForm(false); // Hide form after successful creation
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Landing Page</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Preview sections */}
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-900">Header Section</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-black">{formData.companyName}</p>
                      {/* Add more header content */}
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-900">Hero Section</h3>
                    </div>
                    <div className="p-4">
                      <h2 className="text-2xl font-bold text-black mb-2">
                        Transform Your {formData.companyType} with {formData.companyName}
                      </h2>
                      <p className="text-black">{formData.companyDescription}</p>
                    </div>
                  </div>

                  {/* Add other sections based on selectedSections */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">AI Landing Page</h1>
          <p className="text-center text-gray-600 mb-8">
            Our AI-powered landing page builder helps you create unique landing pages for your business in seconds — no writing, designing or coding required.
          </p>
          <p className="text-center text-gray-500 mb-8">This tool will deduct 1 credit per section.</p>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                >
                  <option value="English (US)">English (US)</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Tone of voice</label>
                <select
                  name="toneOfVoice"
                  value={formData.toneOfVoice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                >
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Company Name*</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Netflix, Spotify, Uber..."
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Company Type*</label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                >
                  <option value="">-- Select --</option>
                  <option value="startup">Startup</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Audience*</label>
                <input
                  type="text"
                  name="audience"
                  placeholder="Designers, Fitness, Restaurant owners..."
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Main Color*</label>
                <div className="mt-1 flex items-center">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300"
                    style={{ backgroundColor: formData.mainColor }}
                  />
                  <select
                    name="mainColor"
                    value={formData.mainColor}
                    onChange={handleInputChange}
                    className="ml-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Company Description*</label>
                <textarea
                  name="companyDescription"
                  placeholder="Explain here to the AI what your product (or service) is about. Rewrite to get different results."
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
                <div className="mt-1 text-sm text-gray-500 flex justify-between">
                  <span>{characterCount}/200</span>
                  {characterCount < 40 && <span className="text-orange-500">40 more characters needed in your description.</span>}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Page Structure* (min 3 / max 8)
                </label>
                <div className="mt-2 space-y-2">
                  {selectedSections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center p-3 bg-gray-50 rounded-md"
                    >
                      <span className="mr-2">≡</span>
                      <span className="text-black">{section.label}</span>
                      <button
                        onClick={() => handleSectionSelect(section.id)}
                        className="ml-auto text-gray-500 hover:text-gray-700"
                      >
                        −
                      </button>
                    </div>
                  ))}
                  
                  {/* Section Selector Dropdown */}
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        handleSectionSelect(e.target.value);
                        e.target.value = ''; // Reset after selection
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                      value=""
                    >
                      <option value="">-- Select section --</option>
                      {availableSections.map((section) => {
                        const isSelected = selectedSections.some(s => s.id === section.id);
                        return (
                          <option 
                            key={section.id} 
                            value={section.id}
                            disabled={isSelected}
                          >
                            {section.label} {isSelected ? '(Selected)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <span className="text-gray-500">+</span>
                    </div>
                  </div>
                </div>
                {selectedSections.length < 3 && (
                  <p className="mt-2 text-sm text-orange-500">
                    Please select at least {3 - selectedSections.length} more section{selectedSections.length < 2 ? 's' : ''}.
                  </p>
                )}
                {selectedSections.length > 8 && (
                  <p className="mt-2 text-sm text-red-500">
                    Maximum 8 sections allowed. Please remove {selectedSections.length - 8} section{selectedSections.length - 8 > 1 ? 's' : ''}.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCreatePage}
              disabled={selectedSections.length < 3 || isLoading}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Creating...' : 'Create new page'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index; 