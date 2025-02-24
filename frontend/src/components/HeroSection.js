import React, { useState } from 'react';
import EditDialog from './EditDialog';

const HeroSection = ({ title, description, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [content, setContent] = useState({ title, description });

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
      default:
        return [];
    }
  };

  // Common classes for editable elements
  const editableClasses = "relative group cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 p-2";
  const editButtonClasses = "opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-opacity duration-200 z-10";

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Title */}
          <h1 
            className={`text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl ${editableClasses}`}
            onClick={() => handleEditClick('title')}
          >
            <span className={editButtonClasses}>Edit</span>
            {content.title}
          </h1>

          {/* Description */}
          <p 
            className={`max-w-2xl mx-auto text-xl text-gray-500 ${editableClasses}`}
            onClick={() => handleEditClick('description')}
          >
            <span className={editButtonClasses}>Edit</span>
            {content.description}
          </p>
          
          {/* CTA Button - No longer editable */}
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingField(null);
        }}
        fields={getFieldsForType(editingField)}
        values={content}
        onChange={handleEdit}
      />
      
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-indigo-100/20" aria-hidden="true" />
    </section>
  );
};

export default HeroSection;
