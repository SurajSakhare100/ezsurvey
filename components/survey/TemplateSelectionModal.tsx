import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: any[];
  settings: any;
}

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
}

export default function TemplateSelectionModal({
  isOpen,
  onClose,
  templates
}: TemplateSelectionModalProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'customer_satisfaction', name: 'Customer Satisfaction' },
    { id: 'employee_feedback', name: 'Employee Feedback' },
    { id: 'market_research', name: 'Market Research' },
    { id: 'product_feedback', name: 'Product Feedback' },
    { id: 'nps', name: 'Net Promoter Score' },
    { id: 'event_feedback', name: 'Event Feedback' },
    { id: 'user_experience', name: 'User Experience' },
    { id: 'training_evaluation', name: 'Training Evaluation' },
    { id: 'demographic', name: 'Demographic' },
    { id: 'exit_survey', name: 'Exit Survey' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    // Navigate to survey creation with template data
    router.push(`/surveys/new?template=${template.id}`);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              Choose a Template
            </Dialog.Title>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="text-sm text-gray-500">
                    {template.questions.length} questions
                  </div>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 