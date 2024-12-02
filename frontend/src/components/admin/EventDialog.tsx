import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { Event, EventFormData } from "@/types/event";
import { ScrollArea } from "../ui/scroll-area";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  event?: Event;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export function EventDialog({
  open,
  onOpenChange,
  onSubmit,
  event,
  isLoading,
  mode
}: EventDialogProps) {
  console.log(open)
  console.log(onOpenChange)
  console.log(isLoading)

  return (
    
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] w-500">
          {/* Wrap only the content that needs to scroll */}
          <EventForm
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </ScrollArea>
        </DialogContent>
      </Dialog>
    
    
  );
}