import { useState } from 'react';
import { Calendar, MapPin, Download, Users } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
interface Event {
  id: string;
  title: string;
  date: string;
  club: string;
  description: string;
  location: string;
  attachments?: { name: string; url: string }[];
  type: 'upcoming' | 'past';
}

const events: Event[] = [
  {
    id: "1",
    title: 'Annual Debate Championship',
    date: '2024-04-15',
    club: 'Debate Society',
    description: 'Join us for our annual debate championship featuring teams from various colleges.',
    location: 'Main Auditorium',
    attachments: [
      { name: 'Event Rules.pdf', url: '#' },
      { name: 'Schedule.pdf', url: '#' }
    ],
    type: 'upcoming'
  },
  {
    id: "2",
    title: 'Robotics Workshop',
    date: '2024-04-20',
    club: 'Robotics Club',
    description: 'Learn the basics of robot programming and participate in a mini competition.',
    location: 'Engineering Lab 101',
    attachments: [
      { name: 'Workshop Materials.pdf', url: '#' }
    ],
    type: 'upcoming'
  },
  {
    id: "3",
    title: 'Photography Exhibition',
    date: '2024-03-10',
    club: 'Photography Club',
    description: 'A showcase of the best photographs taken by our club members throughout the year.',
    location: 'Art Gallery',
    type: 'past'
  }
];
const Events = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  return (
    <>
      <div className="space-y-8  py-8">
        <div className='max-w-7xl mx-auto px-4'>
          <div className="flex justify-between items-center mb-6">
            <h2 className=" text-3xl font-bold text-gray-800">Events</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>

          <div className="grid gap-6">
          <Accordion type="single" collapsible className="w-full">
            {filteredEvents.map((event) => (
              <AccordionItem key={event.id} value={event.id}>
                <AccordionTrigger className="w-full">
                  <div className="flex w-full">
                    <div className="p-2 w-2/3">
                      <div className="flex justify-between items-end mb-4 mr-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                          <div className="flex items-center text-gray-500 space-x-4 mb-2">
                            <span className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <MapPin size={16} className="mr-1" />
                              {event.location}
                            </span>
                            <span className="flex items-center">
                              <Users size={16} className="mr-1" />
                              {event.club}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <div className="p-2 w-2/3">
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {event.attachments?.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Download size={16} className="mr-2" />
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default Events
