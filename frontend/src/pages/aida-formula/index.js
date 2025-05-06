import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';

const AidaFormula = () => {
  const [formData, setFormData] = useState({
    creativity: 'High',
    productName: '',
    productDescription: '',
    targetAudience: '',
    tone: 'professional'
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedContent('');
    setIsLoading(true);

    try {
      const payload = {
        creativity: formData.creativity,
        product_name: formData.productName,
        description: formData.productDescription,
        target_audience: formData.targetAudience,
        tone_of_voice: formData.tone
      };

      const response = await fetch('https://copyright-backend.onrender.com/aida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setGeneratedContent(result.data);
      } else {
        throw new Error(result.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback content if needed
      setGeneratedContent(`Your fallback content here...`);
      alert('Using fallback content due to API error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
        .then(() => {
          alert('Content copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy text to clipboard');
        });
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-gray-50">
        {/* Left side - Form */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-200">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-black">AIDA Formula</h1>
            <p className="text-gray-700 mb-6">
              Generate the oldest copywriting formula used by the biggest brands
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Creativity
                </label>
                <select
                  name="creativity"
                  value={formData.creativity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="Regular">Regular</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Designers"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Generate
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Generated Content */}
        <div className="w-1/2 p-8 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">Generated Content</h2>
              {generatedContent && (
                <div className="space-x-2">
                  <button 
                    onClick={() => setIsSelected(!isSelected)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    {isSelected ? 'Deselect' : 'Select'}
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    Copy Content
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Generating content...</div>
              </div>
            ) : generatedContent ? (
              <div 
                className={`bg-gray-50 p-4 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                }`}
                onClick={() => setIsSelected(!isSelected)}
              >
                <div className="prose prose-sm max-w-none text-gray-900">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Fill out the form and click Generate to create content</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AidaFormula; 