import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronRight, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  photos: Photo[];
}

export interface MonthEvents {
  month: number;
  events: Event[];
}

export interface YearEvents {
  year: number;
  months: MonthEvents[];
}

const eventsData = {
  years: [
    {
      year: 2024,
      months: [
        {
          month: 2,
          events: [
            {
              id: "1",
              name: "Annual Tech Symposium",
              date: new Date("2024-02-15"),
              photos: [
                {
                  id: "1",
                  url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                  title: "Keynote Speech",
                  description: "Opening ceremony of the Tech Symposium"
                },
                {
                  id: "2",
                  url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
                  title: "Innovation Exhibition",
                  description: "Students showcasing their projects"
                },
                {
                  id: "6",
                  url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
                  title: "Innovation Exhibition",
                  description: "Students showcasing their projects"
                },
                {
                  id: "7",
                  url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
                  title: "Innovation Exhibition",
                  description: "Students showcasing their projects"
                },
                {
                  id: "8",
                  url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
                  title: "Innovation Exhibition",
                  description: "Students showcasing their projects"
                }
              ]
            }
          ]
        },
        {
          month: 1,
          events: [
            {
              id: "2",
              name: "New Year Cultural Festival",
              date: new Date("2024-01-05"),
              photos: [
                {
                  id: "3",
                  url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
                  title: "Dance Performance",
                  description: "Traditional dance showcase"
                },
                {
                  id: "4",
                  url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
                  title: "Music Concert",
                  description: "Student band performance"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      year: 2023,
      months: [
        {
          month: 12,
          events: [
            {
              id: "3",
              name: "Winter Graduation Ceremony",
              date: new Date("2023-12-20"),
              photos: [
                {
                  id: "5",
                  url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
                  title: "Graduation Ceremony",
                  description: "Class of 2023 celebration"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
const Gallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
    setExpandedMonth(null);
    setExpandedEvent(null);
  };

  const toggleMonth = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
    setExpandedEvent(null);
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-600">University Events Gallery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 ">
          {/* Navigation Tree */}
          <Card className="p-4 h-[calc(100vh-12rem)] overflow-auto  border border-gray-600">
            <ScrollArea className="h-full">
              {eventsData.years.map((year) => (
                <div key={year.year} className="mb-2">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 transition-colors
                      ${expandedYear === year.year ? 'bg-indigo-50 text-indigo-700' : ''}`}
                    onClick={() => toggleYear(year.year)}
                  >
                    <ChevronRight
                      className={`mr-2 h-4 w-4 transition-transform ${
                        expandedYear === year.year ? 'rotate-90 text-indigo-600' : ''
                      }`}
                    />
                    <FolderOpen className={`mr-2 h-4 w-4 ${expandedYear === year.year ? 'text-indigo-600' : ''}`} />
                    {year.year}
                  </Button>

                  {expandedYear === year.year && (
                    <div className="ml-6">
                      {year.months.map((month) => (
                        <div key={month.month} className="mb-1">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 transition-colors
                              ${expandedMonth === month.month ? 'bg-indigo-50 text-indigo-700' : ''}`}
                            onClick={() => toggleMonth(month.month)}
                          >
                            <ChevronRight
                              className={`mr-2 h-4 w-4 transition-transform ${
                                expandedMonth === month.month ? 'rotate-90 text-indigo-600' : ''
                              }`}
                            />
                            <FolderOpen className={`mr-2 h-4 w-4 ${expandedMonth === month.month ? 'text-indigo-600' : ''}`} />
                            {format(new Date(year.year, month.month - 1), 'MMMM')}
                          </Button>

                          {expandedMonth === month.month && (
                            <div className="ml-6">
                              {month.events.map((event) => (
                                <Button
                                  key={event.id}
                                  variant="ghost"
                                  className={`w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 transition-colors
                                    ${expandedEvent === event.id ? 'bg-indigo-50 text-indigo-700' : ''}`}
                                  onClick={() => toggleEvent(event.id)}
                                >
                                  <ImageIcon className={`mr-2 h-4 w-4 ${expandedEvent === event.id ? 'text-indigo-600' : ''}`} />
                                  {event.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Photo Grid */}
          <Card className="p-6 h-[calc(100vh-12rem)] overflow-auto border border-gray-600">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventsData.years.map((year) =>
                  year.months.map((month) =>
                    month.events.map((event) =>
                      expandedEvent === event.id
                        ? event.photos.map((photo) => (
                            <Card
                              key={photo.id}
                              className="group relative overflow-hidden cursor-pointer border-indigo-100 hover:border-indigo-300 transition-colors"
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <div className="aspect-square">
                                <img
                                  src={photo.url}
                                  alt={photo.title}
                                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-indigo-900/80 to-transparent text-white">
                                <h3 className="font-semibold">{photo.title}</h3>
                                <p className="text-sm opacity-90">
                                  {photo.description}
                                </p>
                              </div>
                            </Card>
                          ))
                        : null
                    )
                  )
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Photo Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            {selectedPhoto && (
              <div>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-auto rounded-lg"
                />
                <h2 className="text-xl font-semibold mt-4 text-indigo-700">
                  {selectedPhoto.title}
                </h2>
                <p className="text-muted-foreground">
                  {selectedPhoto.description}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Gallery
