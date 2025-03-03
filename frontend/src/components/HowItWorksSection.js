import React, { useState } from 'react';
import EditDialog from './EditDialog';

const HowItWorksSection = ({ title, description, services, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [content, setContent] = useState({ title, description, services });

  const handleEdit = (key, value) => {
    const newContent = {
      ...content,
      [key]: value
    };
    setContent(newContent);
    onUpdate?.(newContent);
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setIsEditing(true);
  };

  const getFieldsForType = (type) => {
    switch (type) {
      case 'title':
        return [{ key: 'title', label: 'Title', type: 'text' }];
      case 'description':
        return [{ key: 'description', label: 'Description', type: 'textarea' }];
      case 'service':
        return [
          { key: 'title', label: 'Service Title', type: 'text' },
          { key: 'description', label: 'Service Description', type: 'textarea' }
        ];
      default:
        return [];
    }
  };

  const editableClasses = "relative group cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 p-2";
  const editButtonClasses = "opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-opacity duration-200 z-10";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className={`${editableClasses}`} onClick={() => handleEditClick('title')}>
            <span className={editButtonClasses}>Edit</span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {content.title}
            </h2>
          </div>
          <div className={`mt-4 text-xl text-gray-500 ${editableClasses}`} onClick={() => handleEditClick('description')}>
            <span className={editButtonClasses}>Edit</span>
            <p>{content.description}</p>
          </div>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.services.map((service, index) => (
              <div
                key={index}
                className={`relative p-6 bg-white rounded-lg shadow-sm ${editableClasses}`}
                onClick={() => handleEditClick({ type: 'service', index })}
              >
                <span className={editButtonClasses}>Edit</span>
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
        onClose={() => {
          setIsEditing(false);
          setEditingField(null);
        }}
        fields={getFieldsForType(editingField?.type || editingField)}
        values={editingField?.type === 'service' 
          ? content.services[editingField.index]
          : content}
        onChange={(key, value) => {
          if (editingField?.type === 'service') {
            const newServices = [...content.services];
            newServices[editingField.index] = {
              ...newServices[editingField.index],
              [key]: value
            };
            handleEdit('services', newServices);
          } else {
            handleEdit(key, value);
          }
        }}
      />
    </section>
  );
};

export default HowItWorksSection;