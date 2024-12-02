export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface EventPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  uploadedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  clubName: string;
  description: string;
  location: string;
  attachments: Attachment[];
  photos: EventPhoto[];
  createdAt: string;
  updatedAt: string;
}

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'attachments' | 'photos'> & {
  attachments?: File[];
  photos?: File[];
};