import React, { useState } from 'react';
import EditDialog from './EditDialog';
import GenerateButton from './GenerateButton';

const TestimonialsSection = ({ title, description, testimonialLists, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
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
          { key: 'comment', label: 'Comment', type: 'textarea' },
          { key: 'user', label: 'User Name', type: 'text' },
          { key: 'company', label: 'Company', type: 'text' }
        ];
      default:
        return [];
    }
  };

  const handleGenerate = async (sectionType, generatedContent) => {
    try {
      setContent(generatedContent);
      onUpdate?.(generatedContent);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return (
    <section className="py-16 bg-white relative group">
      <GenerateButton onClick={() => setIsEditing(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            {content.description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {(content.testimonialLists || []).map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8"
            >
              <div className="relative">
                <svg
                  className="absolute -top-4 -left-4 h-8 w-8 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative text-gray-600">{testimonial.comment}</p>
              </div>
              <div className="mt-6">
                <p className="text-base font-semibold text-gray-900">{testimonial.user}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        sectionType="testimonials"
        onGenerate={handleGenerate}
      />
    </section>
  );
};

export default TestimonialsSection;
