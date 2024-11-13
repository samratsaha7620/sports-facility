import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from 'react';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpg","image/jpeg","image/png","application/pdf"];


const formSchema = z.object({
  idCard: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"ID card scanned copy is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only image (JPG ,JPEG, PNG) or PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }),

  birthCertificate: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"Birth certificate is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only image (JPG ,JPEG, PNG) or PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }),

  passportPhoto: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"Passport size photo is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only image (JPG ,JPEG, PNG) or PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }),

  proofOfResidence: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"Proof of residence is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only image (JPG ,JPEG, PNG) or PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }), 
});

export default function Upload({ setCurrentStep, onDataUpdate } :{
  
  setCurrentStep:any,
  onDataUpdate:Dispatch<SetStateAction<any>>,

}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async(data: z.infer<typeof formSchema>) => {

    try{
      await formSchema.parseAsync(data);
      const uploadedFiles = {
        idCard: data.idCard[0],
        birthCertificate: data.birthCertificate[0],
        passportPhoto: data.passportPhoto[0],
        proofOfResidence: data.proofOfResidence[0],
      };
      const uploadPromises = Object.entries(uploadedFiles).map(async ([key, file]) => {
        // Fetch presigned URL from your backend
        const response = await axios.post(`${BACKEND_URL}/api/v1/document/generate-presigned-url`,{
          fileName:file.name,
          fileType: file.type,
        },{
          headers:{
            'Authorization':"Bearer "+ localStorage.getItem("authToken")
          },
        });
        const {getSignedURL}  = response.data;

        // Upload the file to S3 using the presigned URL
        if(getSignedURL){
          await axios.put(getSignedURL,file,{
            headers:{
              'Content-Type': file.type,
            }
          })
        }
        const url = new URL(getSignedURL);
        const myFilePath = `${url.origin}${url.pathname}`;
        return { key, myFilePath }; // Return key and URL or any other relevant info
      });

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      toast.success("Upload Completed");
      console.log('Files uploaded successfully:', uploadResults);
      onDataUpdate(uploadResults);
      setCurrentStep((prev:number) => prev+1);
    }catch(error){
      toast.error("Error Uploading File")
    }
    
  };

  return (
    <Card className="w-2/3 mx-auto p-5 mt-10">
      <CardHeader>
        <CardTitle>Upload Required Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="idCard"
              render={({ field }) => (
                <FormItem className="flex items-center text-enter space-x-2 mb-3">
                  <FormLabel>ID Card Scanned Copy</FormLabel>
                  <FormControl>
                    <Input
                      className="min-w-64 max-w-80"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthCertificate"
              render={({ field }) => (
                <FormItem className="flex items-center text-enter space-x-2 mb-3">
                  <FormLabel>Birth Certificate</FormLabel>
                  <FormControl>
                    <Input
                      className="min-w-64 max-w-80"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportPhoto"
              render={({ field }) => (
                <FormItem className="flex items-center text-enter space-x-2 mb-3">
                  <FormLabel>Passport Size Photo</FormLabel>
                  <FormControl>
                    <Input
                      className="min-w-64 max-w-80"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proofOfResidence"
              render={({ field }) => (
                <FormItem className="flex items-center text-enter space-x-2 mb-3">
                  <FormLabel>Proof of Residence</FormLabel>
                  <FormControl>
                    <Input
                      className="min-w-64 max-w-80"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}