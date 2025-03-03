import React from 'react';

const EditDialog = ({ isOpen, onClose, fields, values, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Edit Content</h3>
          <button 
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-black">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder-gray-400"
                  value={values[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={4}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder-gray-400"
                  value={values[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
              transition-colors duration-200 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialog; 