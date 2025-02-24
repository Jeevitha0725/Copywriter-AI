import React, { useState } from 'react';
import EditDialog from './EditDialog';

const TestimonialsSection = ({ title, description, testimonialLists, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [content, setContent] = useState({ title, description, testimonialLists });

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
      case 'testimonial':
        return [
          { key: 'comment', label: 'Testimonial', type: 'textarea' },
          { key: 'user', label: 'User Name', type: 'text' },
          { key: 'company', label: 'Company', type: 'text' }
        ];
      default:
        return [];
    }
  };

  const editableClasses = "relative group cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 p-2";
  const editButtonClasses = "opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-opacity duration-200 z-10";

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className={`text-3xl font-extrabold text-gray-900 sm:text-4xl ${editableClasses}`}
            onClick={() => handleEditClick('title')}
          >
            <span className={editButtonClasses}>Edit</span>
            {content.title}
          </h2>
          <p 
            className={`mt-4 max-w-2xl mx-auto text-lg text-gray-600 ${editableClasses}`}
            onClick={() => handleEditClick('description')}
          >
            <span className={editButtonClasses}>Edit</span>
            {content.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
          {content.testimonialLists.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg ${editableClasses}`}
              onClick={() => {
                setEditingField({ type: 'testimonial', index });
                setIsEditing(true);
              }}
            >
              <span className={editButtonClasses}>Edit</span>
              <p className="text-gray-700 text-lg mb-6">"{testimonial.comment}"</p>
              <div className="flex items-center">
                {testimonial.avatar && (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.user}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.user}</div>
                  <div className="text-indigo-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingField(null);
        }}
        fields={getFieldsForType(editingField?.type || editingField)}
        values={editingField?.type === 'testimonial' 
          ? content.testimonialLists[editingField.index] 
          : content}
        onChange={(key, value) => {
          if (editingField?.type === 'testimonial') {
            const newTestimonials = [...content.testimonialLists];
            newTestimonials[editingField.index] = {
              ...newTestimonials[editingField.index],
              [key]: value
            };
            handleEdit('testimonialLists', newTestimonials);
          } else {
            handleEdit(key, value);
          }
        }}
      />
    </section>
  );
};

export default TestimonialsSection;
