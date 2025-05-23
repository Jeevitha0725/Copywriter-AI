import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';

const QuestFormula = () => {
  const [formData, setFormData] = useState({
    creativity: 'Regular',
    productName: '',
    productDescription: '',
    targetAudience: '',
    language: 'English(US)'
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
        language: formData.language
      };

      const response = await fetch('https://copyright-backend.onrender.com/quest', {
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
            <h1 className="text-2xl font-bold mb-6 text-black">QUEST Formula</h1>
            <p className="text-gray-700 mb-6">
              Write a Qualify-Understand-Educate-Stimulate-Transition copy
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  >
                    <option value="English(US)">🇺🇸 English (US)</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  >
                    <option value="Regular">Regular</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Netflix, Spotify, Uber..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience*
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Freelancers, Designers..."
                  required
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Description*
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.productDescription.length}/400
                  </span>
                </div>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  rows={4}
                  maxLength={400}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Explain here to the AI what your product (or service) is about. Rewrite to get different results."
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
              <div>
                <h2 className="text-xl font-semibold text-black">QUEST Formula</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Not sure how this works? Get an example by clicking on the button below:
                </p>
              </div>
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
                <div className="text-gray-500">Generate results by filling up the form on the left and clicking on "Generate"</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestFormula; 