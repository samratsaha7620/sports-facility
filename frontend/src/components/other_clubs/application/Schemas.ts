
import z from "zod";

export const FormValuesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sexType: z.number().min(1, "Please select a gender"),
  dob: z.string().min(1, "Date of Birth is required"),
  dept: z.string().min(1, "Department is required"),
  rollno: z.string().min(1, "Roll number is required for TU Student"),
  semester: z.string().min(1, "Semester is required for TU Student"),
})



const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpg","image/jpeg","image/png","application/pdf"];


const UploadSchema = z.object({
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
 
});


export const stepSchemas = [FormValuesSchema, UploadSchema];
export type FormVlauesData = z.infer<typeof FormValuesSchema>;
export type UploadData = z.infer<typeof UploadSchema>;