import React, { useState } from 'react';
import EditDialog from './EditDialog';

const AboutUsSection = ({ title, description, onUpdate }) => {
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

  const editableClasses = "relative group cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 p-2";
  const editButtonClasses = "opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-opacity duration-200 z-10";

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content Side */}
          <div className="mb-12 lg:mb-0">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h2 
              className={`text-3xl font-extrabold text-gray-900 sm:text-4xl ${editableClasses}`}
              onClick={() => handleEditClick('title')}
            >
              <span className={editButtonClasses}>Edit</span>
              {content.title}
            </h2>
            <div 
              className={`mt-6 text-lg text-gray-600 ${editableClasses}`}
              onClick={() => handleEditClick('description')}
            >
              <span className={editButtonClasses}>Edit</span>
              {typeof content.description === 'string' ? (
                <p>{content.description}</p>
              ) : (
                content.description.map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))
              )}
            </div>
            
            {/* Optional Stats */}
            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">10+</div>
                <div className="mt-1 text-gray-500">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">500+</div>
                <div className="mt-1 text-gray-500">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-600">99%</div>
                <div className="mt-1 text-gray-500">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="aspect-w-5 aspect-h-6 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/path-to-your-image.jpg"
                alt="About Us"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 transform rotate-6 rounded-2xl scale-95 translate-x-4 translate-y-4"></div>
          </div>
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
    </section>
  );
};

export default AboutUsSection;
