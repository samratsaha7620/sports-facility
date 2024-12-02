import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL, MEDICAL_CERTIFICATE_URL } from "@/config";
import toast from "react-hot-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MembershipPDF from "./MembershipData";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";


const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf"];


const formSchema = z.object({
  medicalCertificate: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"Medical Certificate  copy is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }),

  signedApplicationForm: z
  .instanceof(FileList)
  .refine((files) => files.length > 0, {
    message:"Signed Application Form is required.",
  })
  .refine((files) => ALLOWED_FILE_TYPES.includes(files[0].type),{
    message:"Only PDF files are allowed."
  })
  .refine((files) => files[0].size <= MAX_FILE_SIZE,{
    message:"File size must not exceed 2 MB."
  }),
   
});

const FinalSubmission = ({applicationId}:{applicationId:string}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const applicationData = location.state?.applicationData;
  const [uploadedFiles, setUploadedFiles] = useState({
    medicalCertificate: "",
    signedApplicationForm: "",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFileUpload = async(fieldName: keyof typeof uploadedFiles, file: File | undefined) =>{
    if(!file) return;
    try{
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
      setUploadedFiles((prev) => ({...prev,[fieldName]:myFilePath}));
      toast.success(`${fieldName} uploaded successfully`);
    }catch(error){
      toast.error(`Error uploading ${fieldName}`);
    }
  }

  const onSubmit = async() => {
    if (!uploadedFiles.medicalCertificate || !uploadedFiles.signedApplicationForm) {
      toast.error("Please upload all required documents before submitting.");
      return;
    }

    try{
      console.log(uploadedFiles);
      const response = await axios.patch(`${BACKEND_URL}/api/v1/applications/${applicationId}/update`,uploadedFiles,{
        headers:{
          Authorization:"Bearer "+ localStorage.getItem("authToken")
        }
      })
      if (response.status === 200) {
        toast.success('Application updated successfully!');
        console.log('Updated application:', response.data);
        navigate('/user-dashboard');
      } else {
        toast.error('Failed to update the application.');
      }
    }catch(error){
      toast.error("Error Uploading File")
    }    
  };
  return (
    <div className="p-5">
      <div className="w-2/3 mx-auto text-center p-5 mb-5 border border-slate-300 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Important Instructions</h2>

        <p className="text-gray-600 mt-2">
          Please follow the steps below to complete your application:
        </p>

        <ul className="list-disc list-inside text-left mt-4 mx-auto max-w-lg">
          <li>
            Download your application form by clicking the button below, sign it, and keep it ready for submission.
          </li>
          <li>
            Download the medical certificate using the link provided below, have it issued by a CMO, TU, or an MBBS doctor certifying that you are medically fit for swimming and do not suffer from any contagious disease.
          </li>
          <li>
            Upload the signed application form in the "Birth Certificate" field and the medical certificate in the "ID Card Scanned Copy" field.
          </li>
        </ul>

        <div className="flex justify-center items-center mt-5 space-x-4">
          <PDFDownloadLink
           document={<MembershipPDF data={applicationData} />}
           fileName="membership.pdf"
          >
            <Button className=" bg-slate-600 text-white hover:bg-slate-700 transition duration-200">
              Download Your Application Form
            </Button>
          </PDFDownloadLink>

          <div>
            <Button className="bg-slate-600 text-white hover:bg-slate-700 transition duration-200">
                <a 
                href={MEDICAL_CERTIFICATE_URL} // Replace with actual link
                target="_blank" 
                rel="noopener noreferrer"
              >
                  Download Medical Certificate Template
                </a>
            </Button>
          </div>
        </div>

      </div>

      <Card className="w-2/3 mx-auto p-5 mt-10 border border-slate-300">
        <CardHeader>
          <CardTitle>Upload Required Documents</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="medicalCertificate"
                render={({ field }) => (
                  <FormItem className="flex items-center text-enter space-x-2 mb-3">
                    <FormLabel>Signed Copy of Your Application Form</FormLabel>
                    <FormControl>
                      <Input
                        className="min-w-64 max-w-80"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <Button type="button" onClick={() => handleFileUpload("medicalCertificate", field.value?.[0])}>Upload</Button>
                    {uploadedFiles.medicalCertificate && <a 
                    href={uploadedFiles.medicalCertificate} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:underline ml-4" 
                    >View Document</a>}
                  
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="signedApplicationForm"
                render={({ field }) => (
                  <FormItem className="flex items-center text-enter space-x-2 mb-3">
                    <FormLabel>Medical Certificate Issued By a Doctor</FormLabel>
                    <FormControl>
                      <Input
                        className="min-w-64 max-w-80"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <Button type="button" onClick={() => handleFileUpload("signedApplicationForm", field.value?.[0])}>Upload</Button>
                    {uploadedFiles.signedApplicationForm && <a 
                    href={uploadedFiles.signedApplicationForm} target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:underline ml-4"
                    >View Document</a>}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full ">Complete Your Application</Button>
            </form>
          </Form>
        </CardContent>

      </Card>
    </div>
    
  )
}

export default FinalSubmission
