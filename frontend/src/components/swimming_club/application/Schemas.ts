
import z from "zod";

const baseDetailsSchema = z.object({
  membershipType: z.string().min(1, "Please select a membership type"),
  name: z.string().min(1, "Name is required"),
  sexType: z.number().min(1, "Please select a gender"),
  dob: z.string().min(1, "Date of Birth is required"),
  dept: z.string().min(1, "Department is required"),
  membershipCategory: z.string().min(1 ,"Please select a membership category"),
})

const tuStudentSchema = baseDetailsSchema.extend({
membershipCategory: z.literal("TU Student"),
rollno: z.string().min(1, "Roll number is required for TU Student"),
semester: z.string().min(1, "Semester is required for TU Student"),
localGuardian: z.string().min(2, "Local guardian name is required"),
local_contact: z.string().min(10, "Local contact is required"),
})

const tuEmployeeSchema = baseDetailsSchema.extend({
membershipCategory: z.literal("TU Employee"),
emp_code: z.string().min(1, "Employee code is required for TU Employee"),
designation: z.string().min(1, "Designation is required for TU Employee"),
})

const tuEmployeeChildSchema  = baseDetailsSchema.extend({
membershipCategory: z.literal("TU Employee Child"),
emp_code: z.string().min(1, "Employee code is required for TU Employee"),
designation: z.string().min(1, "Designation is required for TU Employee"),
relativeName: z.string().min(1, "Relative name is required"),
relationWithEmployee: z.string().min(1, "Relation with employee is required"),
residingSince: z.string().min(1, "Residing since is required"),
membershipFrom: z.string().min(1, "Membership from is required"),
membershipTo: z.string().min(1, "Membership to is required"),
})

const tuEmployeeDependentSchema   = tuEmployeeSchema.extend({
membershipCategory: z.literal("TU Employee Dependent"),
emp_code: z.string().min(1, "Employee code is required for TU Employee"),
designation: z.string().min(1, "Designation is required for TU Employee"),
relativeName: z.string().min(1, "Relative name is required"),
relationWithEmployee: z.string().min(1, "Relation with employee is required"),
residingSince: z.string().min(1, "Residing since is required"),
membershipFrom: z.string().min(1, "Membership from is required"),
membershipTo: z.string().min(1, "Membership to is required"),
})

const tuEmployeeOtherRelativeSchema  = baseDetailsSchema .extend({
membershipCategory: z.literal("TU Employee Other Relative"),
emp_code: z.string().min(1, "Employee code is required for TU Employee"),
designation: z.string().min(1, "Designation is required for TU Employee"),
relativeName: z.string().min(1, "Relative name is required"),
relationWithEmployee: z.string().min(1, "Relation with employee is required"),
residingSince: z.string().min(1, "Residing since is required"),
membershipFrom: z.string().min(1, "Membership from is required"),
membershipTo: z.string().min(1, "Membership to is required"),
})

const tuProjectStuffSchema = baseDetailsSchema.extend({
membershipCategory: z.literal("Project staff")
})
const tuEmpCampusSchema = baseDetailsSchema.extend({
membershipCategory: z.literal("Employees of campus organization")
})
const tuGuestSchema = baseDetailsSchema.extend({
membershipCategory: z.literal("Guest")
})


export const FormValuesSchema = z.discriminatedUnion('membershipCategory', [
tuStudentSchema,
tuEmployeeSchema,
tuEmployeeChildSchema,
tuEmployeeDependentSchema,
tuEmployeeOtherRelativeSchema,
tuProjectStuffSchema,
tuEmpCampusSchema,
tuGuestSchema
])
.superRefine((data, ctx) => {
if (!data.membershipCategory) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Please select a membership category", // Custom error message
    path: ["membershipCategory"],
  });
}
});


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


export const stepSchemas = [FormValuesSchema, UploadSchema];
export type FormVlauesData = z.infer<typeof FormValuesSchema>;
export type UploadData = z.infer<typeof UploadSchema>;