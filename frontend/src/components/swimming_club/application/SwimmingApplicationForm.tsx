import FormPage from '@/Form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { FormValuesSchema } from './Schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';


const membershipCategories = [
  { id: 1, name: "TU Student" },
  { id: 2, name: "TU Employee" },
  { id: 3, name: "TU Employee Child" },
  { id: 4, name: "TU Employee Dependent" },
  { id: 5, name: "TU Employee Other Relative" },
  { id: 6, name: "Project staff" },
  { id: 7, name: "Employees of campus organization" },
  { id: 8, name: "Guest" },
];

const membershipTypes = [
  { id: 1, name: "One month" },
  { id: 2, name: "Three months" },
  { id: 3, name: "Half season" },
  { id: 4, name: "Full season" },
]

const sexTypes = [
  {id :1 , type :"Male"},
  {id :2 , type :"Female"},
]
type FormValues = z.infer<typeof FormValuesSchema>;

const SwimmingApplicationForm = ({setCurrentStep,onDatatUpdate}:{setCurrentStep:any,
  onDatatUpdate:Dispatch<SetStateAction<any>>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } =  useForm<FormValues>({
    resolver: zodResolver(FormValuesSchema),
    defaultValues:{
      membershipCategory: undefined,
      membershipType: "",
      sexType:undefined,
      name:"",
      emp_code:"",
      rollno:"",
      semester:'',
      dept:"",
      local_contact:"",
      localGuardian:"",
      designation:"",
      dob: "",
      relativeName: "",
      relationWithEmployee: "",
      residingSince: "",
      membershipFrom: "",
      membershipTo: "",
    }
  })
  
  const membershipCategory = watch('membershipCategory');
  const membershipType = watch('membershipType');


  const name = watch('name');
  const sexType = watch('sexType');
  const dob = watch('dob');
  const dept = watch('dept');
  
  const emp_code =  watch('emp_code');
  const rollno = watch("rollno");
  const semester = watch("semester");
  const designation = watch('designation')
  const localGuardian = watch("localGuardian");
  const local_contact = watch('local_contact');

  const relativeName = watch("relativeName");
  const relationWithEmployee = watch("relationWithEmployee");
  const residingSince = watch("residingSince");
  const membershipFrom = watch("membershipFrom");
  const membershipTo = watch("membershipTo");


  const setCustomValue =(id:string, value:any) =>{
    setValue(id as keyof FormValues , value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })

    
  }

  const onSubmit = (data:any)=>{
    onDatatUpdate(data);
    setCurrentStep((prev: number) => prev+1);
  }

  let bodyContent = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Membership Category</h3>
      <Select 
      onValueChange={(value) => setCustomValue('membershipCategory', value)}
      defaultValue={membershipCategory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {membershipCategories.map((category) => (
            <SelectItem 
            key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.membershipCategory && 
      <p className="text-red-500">
        {errors.membershipCategory.message}
      </p>
      }

      <h3 className="text-lg font-semibold">Membership Type</h3>
      <Select 
      onValueChange={(value) => setCustomValue('membershipType', value)}
      defaultValue={membershipType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a membership type" />
        </SelectTrigger>
        <SelectContent>
          {membershipTypes.map((type) => (
            <SelectItem key={type.id} value={type.name}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.membershipType  && 
      <p className="text-red-500">
        {typeof errors.membershipType.message === 'string'
          ? errors.membershipType.message
          : 'Please select a valid Type.'}
      </p>
      }
      <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
          <Label htmlFor="name" className="mb-3">Name (IN BLOCK LETTER)</Label>
          <Input
            {...register('name')}
            value={name}
            onChange={(e) => setCustomValue('name', e.target.value)}
            type="text"
            id="name"
            placeholder="Enter Your Name"
          />
          {errors.name  && 
            <p className="text-red-500">
              {typeof errors.name.message === 'string'
                ? errors.name.message
                : 'Please Enter Your Name.'}
            </p>
          }
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
          <Label htmlFor="dept" className="mb-3">Department</Label>
          <Input
            {...register('dept')}
            value={dept}
            onChange={(e) => setCustomValue('dept', e.target.value)}
            type="text"
            id="dept"
            placeholder="CSE"
          />
          {errors.dept  && 
            <p className="text-red-500">
              {typeof errors.dept.message === 'string'
                ? errors.dept.message
                : 'Please Enter Department Name.'}
            </p>
          }
        </div>

        <div className="flex items-center justify-between mb-6">
          <div >
            <div className='flex items-center justify-between'>
            <Label htmlFor="sexType" className="text-lg font-semibold mr-3">Sex</Label>
              {sexTypes.map((sex) => (
                <div key={sex.id} className="flex items-center mr-4">
                  <Checkbox
                    id={`category-${sex.id}`}
                    checked={sexType === sex.id}
                    onCheckedChange={() => setCustomValue('sexType', sex.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${sex.id}`}>{sex.type}</label>
                </div>
              ))}
              {errors.sexType  && 
            <p className="text-red-500">
              {typeof errors.sexType.message === 'string'
                ? errors.sexType.message
                : 'Please select your sextype.'}
            </p>
          }
            </div>
          </div>

          <div className=" flex items-center justify-between ">
            <div>
            <Label htmlFor="dob" className='whitespace-nowrap mr-3'>Date Of Birth</Label>
            </div>  
            <Input
              {...register('dob')}
              value={dob}
              onChange={(e) => setCustomValue('dob', e.target.value)}
              type="date"
              id="dob"
              placeholder="YYYY-MM-DD"
            />
            {errors.dob  && 
            <p className="text-red-500">
              {typeof errors.dob.message === 'string'
                ? errors.dob.message
                : 'Please Enter your date of birth.'}
            </p>
          }
          </div>
        </div>

        {membershipCategory === 'TU Student' && (
          <div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="rollno" className="mb-3">Roll Number</Label>
              <Input
                {...register('rollno')}
                value={rollno}
                onChange={(e) => setCustomValue('rollno', e.target.value)}
                type="text"
                id="rollno"
                placeholder="Enter Your Roll Number"
              />
              {(errors as any).rollno  && 
                <p className="text-red-500">
                  {typeof (errors as any).rollno.message === 'string'
                    ? (errors as any).rollno.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="semester" className="mb-3">Semester</Label>
              <Input
                {...register('semester')}
                value={semester}
                onChange={(e) => setCustomValue('semester', e.target.value)}
                type="text"
                id="semester"
                placeholder="1"
              />
              {(errors as any).semester  && 
                <p className="text-red-500">
                  {typeof (errors as any).semester.message === 'string'
                    ? (errors as any).semester.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="localGuardian">Name & address of the local guardian</Label>
              <Textarea 
              {...register("localGuardian")}
              value={localGuardian}
              placeholder="Type your message here." id="localGuardian" />
              {(errors as any).localGuardian  && 
                <p className="text-red-500">
                  {typeof (errors as any).localGuardian.message === 'string'
                    ? (errors as any).localGuardian.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="local-contact" className="mb-3">Contact no of the local guardian</Label>
              <Input
                {...register('local_contact')}
                value={local_contact}
                onChange={(e) => setCustomValue('local_contact', e.target.value)}
                type="text"
                id="local-contact"
                placeholder="0123456789"
              />
              {(errors as any).local_contact  && 
                <p className="text-red-500">
                  {typeof (errors as any).local_contact.message === 'string'
                    ? (errors as any).local_contact.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
          </div>
        )}
        {(membershipCategory === "TU Employee" ||
          membershipCategory === "TU Employee Child"  ||
          membershipCategory === "TU Employee Dependent" ||
          membershipCategory === "TU Employee Other Relative"
        ) && (
          <div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
            <Label htmlFor="emp_code" className="mb-3">Employee code no(For Employee)</Label>
            <Input
              {...register('emp_code')}
              value={emp_code}
              onChange={(e) => setCustomValue('emp_code', e.target.value)}
              type="text"
              id="emp_code"
              placeholder="Enter Your Employee Code Number"
            />
            {(errors as any).emp_code  && 
                <p className="text-red-500">
                  {typeof (errors as any).emp_code.message === 'string'
                    ? (errors as any).emp_code.message
                    : 'Please select your sextype.'}
                </p>
              }
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
            <Label htmlFor="designation" className="mb-3">Designation(For Employee)</Label>
            <Input
              {...register('designation')}
              value={designation}
              onChange={(e) => setCustomValue('designation', e.target.value)}
              type="text"
              id="designation"
              placeholder="Enter Your Employee Designation"
            />
            {(errors as any).designation  && 
                <p className="text-red-500">
                  {typeof (errors as any).designation.message === 'string'
                    ? (errors as any).designation.message
                    : 'Please select your sextype.'}
                </p>
              }
          </div>
        </div>
        )}

        {(membershipCategory === "TU Employee Child"  ||
          membershipCategory === "TU Employee Dependent" ||
          membershipCategory === "TU Employee Other Relative"
        ) && (
          <div>       
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="relativeName" className='mb-3'>Name of the Child/Dependent/Other Relative</Label>
              <Input
                {...register('relativeName')}
                value={relativeName}
                onChange={(e) => setCustomValue('relativeName', e.target.value)}
                type="text"
                id="relativeName"
                placeholder="Enter relative's name"
              />
              {(errors as any).relativeName  && 
                <p className="text-red-500">
                  {typeof (errors as any).relativeName.message === 'string'
                    ? (errors as any).relativeName.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
      
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="relationWithEmployee" className='mb-3'>Relation with the Employee</Label>
              <Input
                {...register('relationWithEmployee')}
                value={relationWithEmployee}
                onChange={(e) => setCustomValue('relationWithEmployee', e.target.value)}
                type="text"
                id="relationWithEmployee"
                placeholder="Enter relation (e.g., child, spouse)"
              />
              {(errors as any).relationWithEmployee  && 
                <p className="text-red-500">
                  {typeof (errors as any).relationWithEmployee.message === 'string'
                    ? (errors as any).relationWithEmployee.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
      
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="residingSince" className='mb-3'>The relative has been residing in the campus with me since</Label>
              <Input
                {...register('residingSince')}
                value={residingSince}
                onChange={(e) => setCustomValue('residingSince', e.target.value)}
                type="date"
                id="residingSince"
                placeholder="YYYY-MM-DD"
              />
              {(errors as any).residingSince  && 
                <p className="text-red-500">
                  {typeof (errors as any).residingSince.message === 'string'
                    ? (errors as any).residingSince.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
      
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="membershipFrom" className='mb-3'>Membership required for the period from</Label>
              <Input
                {...register('membershipFrom')}
                value={membershipFrom}
                onChange={(e) => setCustomValue('membershipFrom', e.target.value)}
                type="date"
                id="membershipFrom"
                placeholder="YYYY-MM-DD"
              />
              {(errors as any).membershipFrom  && 
                <p className="text-red-500">
                  {typeof (errors as any).membershipFrom.message === 'string'
                    ? (errors as any).membershipFrom.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
      
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
              <Label htmlFor="membershipTo" className='mb-3'>Membership required for the period to</Label>
              <Input
                {...register('membershipTo')}
                value={membershipTo}
                onChange={(e) => setCustomValue('membershipTo', e.target.value)}
                type="date"
                id="membershipTo"
                placeholder="YYYY-MM-DD"
              />
              {(errors as any).membershipTo  && 
                <p className="text-red-500">
                  {typeof (errors as any).membershipTo.message === 'string'
                    ? (errors as any).membershipTo.message
                    : 'Please select your sextype.'}
                </p>
              }
            </div>
          </div>
        )}
    </div>
  )

  return (
    <FormPage
    title='Register For Swimming Pool Club'
    actionlabel="Submit Application"
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    />
  )
}

export default SwimmingApplicationForm;