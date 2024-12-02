import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventList } from '@/components/admin/EventList';
import { Event, EventFormData } from '@/types/event';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { EventDialog } from '@/components/admin/EventDialog';

const AdminEventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [dialogOpen ,setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  // useEffect(() => {
  //   fetchEvents();
  // })

  // const fetchEvents = async () => {
  //   try {
  //     const response = await axios.get(`${BACKEND_URL}/events`);
  //     setEvents(response.data);
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to fetch events',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  const handleCreateSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'attachments' && key !== 'photos') {
          formData.append(key, value);
        }
      });

      data.attachments?.forEach((file) => {
        formData.append('attachments', file);
      });

      data.photos?.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await axios.post(`${BACKEND_URL}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setEvents((prev) => [...prev, response.data]);
      setIsCreating(false);
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (data: EventFormData) => {
    if (!editingEvent) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'attachments' && key !== 'photos') {
          formData.append(key, value);
        }
      });

      data.attachments?.forEach((file) => {
        formData.append('attachments', file);
      });

      data.photos?.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await axios.put(
        `${BACKEND_URL}/events/${editingEvent.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id ? response.data : event
        )
      );
      setEditingEvent(null);
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/events/${eventId}`);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const handleEdit  = (event:Event) =>{
    setEditingEvent(event);
    setDialogOpen(true);
  }
 
  const handleDialogClose = () =>{
    setDialogOpen(false);
    setEditingEvent(null);
  }

  return (
    <div className="container mx-auto py-10 px-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {/* <EventList
        events={events}
        onEdit={setEditingEvent}
        onDelete={handleDelete}
      /> */}

      <EventDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={editingEvent ? handleEditSubmit : handleCreateSubmit}
        event={editingEvent || undefined}
        isLoading={isLoading}
        mode={editingEvent ? 'edit' : 'create'}
      />

    </div>
  );
}

export default AdminEventsManager
