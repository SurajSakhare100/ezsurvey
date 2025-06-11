import { Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  surveyTitle: string
  isDeleting: boolean
}

export default function DeleteSurveyModal({
  isOpen,
  onClose,
  onConfirm,
  surveyTitle,
  isDeleting
}: DeleteSurveyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Delete Survey</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete &quot;{surveyTitle}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Survey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 