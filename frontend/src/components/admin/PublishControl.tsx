import React, { useState } from 'react';
import axios from 'axios';
import {z} from 'zod';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/config';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';


interface PublishControlProps {
  clubId: string;
  initialStatus: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
}

const dateSchema = z.object({
  endDate: z.string().refine(
    (date) => new Date(date) >= new Date(),
    {message:"End date cannot be before today."}
  )
})

type DateFormData = z.infer<typeof dateSchema>;

const PublishControl: React.FC<PublishControlProps> = ({ clubId, initialStatus}) => {
  const [showModal,setShowModal] = useState(false);
  const [isPublished, setIsPublished] = useState(initialStatus);
  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublish = async (data:DateFormData) => {
    console.log(data);
    setIsLoading(true);
    try {
      const endpoint = isPublished 
        ? `${BACKEND_URL}/api/v1/clubs/club/${clubId}/unpublish` 
        : `${BACKEND_URL}/api/v1/clubs/club/${clubId}/publish`;
      
      const response = await axios.patch(endpoint, {
        publishStartDate: isPublished ? null : (startDate || null),
        publishEndDate: isPublished ? null : (data.endDate || null),
      });

      setIsPublished(response.data.isApplicationPublished);
      setShowModal(false);
      toast.success(`Application ${response.data.isApplicationPublished ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error(`Failed to ${isPublished ? 'unpublish' : 'publish'} application`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogMemo
      showModal = {showModal}
      setShowModal ={setShowModal}
      isPublished={isPublished}
      startDate={startDate}
      onSubmit={handleTogglePublish}
      isLoading={isLoading}
      />
    </>
  );
};

interface DialogMemoProps {
  showModal:boolean;
  setShowModal :React.Dispatch<React.SetStateAction<boolean>>;
  isPublished: boolean;
  startDate: string;
  onSubmit: (data: DateFormData) => void;
  isLoading: boolean;
}

const DialogMemo: React.FC<DialogMemoProps> = ({ showModal,setShowModal,isPublished, startDate, onSubmit, isLoading }) => {
  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, formState: { errors } } = useForm<DateFormData>({
    resolver: zodResolver(dateSchema),
    defaultValues: { endDate: today },
  });

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{!isPublished ? "Swimming Pool Application":"Unpublish The Form"}</DialogTitle>
          <DialogDescription>
            {isPublished ? "Are you sure want to Unpubish the Form..." : "Publish the form for applicants"}
          </DialogDescription>
        </DialogHeader>
        {!isPublished ?
        (<form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-center col-span-2">
                Start Date For Application
              </Label>
              <Input
                className="col-span-2"
                type="date"
                id="startDate"
                value={startDate}
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-center col-span-2">
                End Date For Submission
              </Label>
              <Input
                className="col-span-2"
                type="date"
                id="endDate"
                {...register("endDate")}
                min={today}
                disabled={isPublished}
              />
              {errors.endDate && (
                <p className="text-red-500 col-span-4 text-center">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
        ):(
          <div>
            <Button>Unpublish</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishControl;