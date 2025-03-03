import React, { useState } from 'react';
import EditDialog from './EditDialog';

const HeaderSection = ({ logo, links, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [content, setContent] = useState({ logo, links });

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
      case 'logo':
        return [{ key: 'logo', label: 'Logo Text', type: 'text' }];
      case 'link':
        return [{ key: 'text', label: 'Link Text', type: 'text' }];
      default:
        return [];
    }
  };

  const editableClasses = "relative group cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 p-2";
  const editButtonClasses = "opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-opacity duration-200 z-10";

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div 
              className={`flex-shrink-0 flex items-center text-xl font-bold text-gray-900 ${editableClasses}`}
              onClick={() => handleEditClick('logo')}
            >
              <span className={editButtonClasses}>Edit</span>
              {content.logo}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            {content.links.map((link, index) => (
              <div
                key={index}
                className={`text-gray-700 hover:text-gray-900 ${editableClasses}`}
                onClick={() => {
                  setEditingField({ type: 'link', index });
                  setIsEditing(true);
                }}
              >
                <span className={editButtonClasses}>Edit</span>
                {link}
              </div>
            ))}
            <button className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
              Contact Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <EditDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingField(null);
        }}
        fields={getFieldsForType(editingField?.type || editingField)}
        values={editingField?.type === 'link' 
          ? { text: content.links[editingField.index] }
          : content}
        onChange={(key, value) => {
          if (editingField?.type === 'link') {
            const newLinks = [...content.links];
            newLinks[editingField.index] = value;
            handleEdit('links', newLinks);
          } else {
            handleEdit(key, value);
          }
        }}
      />
    </header>
  );
};

export default HeaderSection;
