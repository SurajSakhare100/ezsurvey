import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText } from 'lucide-react';

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSurveyModal({ isOpen, onClose }: CreateSurveyModalProps) {
  const router = useRouter();

  const handleCreateFromScratch = () => {
    router.push('/dashboard/new');
    onClose();
  };

  const handleUseTemplate = () => {
    router.push('/templates');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Create New Survey
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <button
                    onClick={handleCreateFromScratch}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Plus className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Start from scratch</h4>
                        <p className="text-sm text-gray-500">Create a custom survey from the beginning</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleUseTemplate}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Use a template</h4>
                        <p className="text-sm text-gray-500">Choose from pre-built survey templates</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 