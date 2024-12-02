import FormPage from '@/Form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { FormValuesSchema } from './Schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';


const choiceOfDisciplines  = [
  { id: 1, name: "Shapeup/Keep fit" },
  { id: 2, name: "Bodybuilding" },
  { id: 3, name: "Power lifting" },
  { id: 4, name: "Arm wrestling " },
  { id: 5, name: "Weight lifting" },
  { id: 6, name: "Other game" },
];

const sexTypes = [
  {id :1 , type :"Male"},
  {id :2 , type :"Female"},
]

type FormValues = z.infer<typeof FormValuesSchema>;

const GymApplicationForm = ({setCurrentStep,onDatatUpdate}:{setCurrentStep:any,
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
      choiceOfDiscipline:[],
      sexType:undefined,
      name:"",
      rollno:"",
      semester:'',
      dept:"",
      dob: "",
    }
  })
  const [disciplineDropdownOpen, setDisciplineDropdownOpen] = useState(false);
  const choiceOfDiscipline = watch('choiceOfDiscipline') || [];

  const name = watch('name');
  const sexType = watch('sexType');
  const dob = watch('dob');
  const dept = watch('dept');
  const rollno = watch("rollno");
  const semester = watch("semester");

  const toggleDiscipline = (discipline: string) => {
    const updatedSelection = choiceOfDiscipline.includes(discipline)
      ? choiceOfDiscipline.filter((item: string) => item !== discipline)
      : [...choiceOfDiscipline, discipline];
    setValue('choiceOfDiscipline', updatedSelection, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const setCustomValue =(id:string, value:any) =>{
    setValue(id as keyof FormValues , value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })  
  }

  const onSubmit = (data:any)=>{
    console.log(data);
    onDatatUpdate(data);
    setCurrentStep((prev: number) => prev+1);
  }

  let bodyContent = (
    <div className="space-y-4 ">
      <h3 className="text-lg font-semibold">Choice Of Discipline</h3>
      <Popover
        open={disciplineDropdownOpen}
        onOpenChange={setDisciplineDropdownOpen}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {choiceOfDiscipline.length > 0
              ? choiceOfDiscipline.join(', ')
              : 'Select disciplines'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="p-4 space-y-2">
            {choiceOfDisciplines.map((choice) => (
              <div
                key={choice.id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={`discipline-${choice.id}`} className="mr-2">
                  {choice.name}
                </Label>
                <Checkbox
                  id={`discipline-${choice.id}`}
                  checked={choiceOfDiscipline.includes(choice.name)}
                  onCheckedChange={() => toggleDiscipline(choice.name)}
                />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {errors.choiceOfDiscipline && (
        <p className="text-red-500">
          {errors.choiceOfDiscipline.message}
        </p>
      )}
      
      {/* name */}
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

      {/* department */}
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

      {/* sex and dob */}
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
      
      {/* roll no */}
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

      {/* semester */}
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
    </div>
  )

  return (
    <FormPage
    title='Register For Gymnasium Club'
    actionlabel="Next"
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    />
  )
}

export default GymApplicationForm;