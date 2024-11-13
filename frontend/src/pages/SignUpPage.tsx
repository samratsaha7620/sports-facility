import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import axios from "axios";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_URL } from '@/config';
import { useNavigate } from 'react-router-dom';


const FormSchema = z.object({
  name: z.string().min(1 ,"Name is required"),
  email: z.string()
    .email("This is not a valid email.")
    .refine((val) => val.endsWith("@tezu.ac.in"), {
      message: "Email must end with @tezu.ac.in.Enter Your G-Suite email id",
    }),
  phno : z.string().regex(/^\d{10}$/ , "Phone number must be exactly 10 digits."),
  password: z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" }),
});


type FormInput = z.infer<typeof FormSchema>;

const SignUpPage = () => {
  const navigate =  useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm<FormInput>({
    resolver:zodResolver(FormSchema),
    defaultValues:{
      name:"",
      email:"",
      phno:"",
      password:""
    }
  })
  
  const onSubmit:SubmitHandler<FormInput> = (data) =>{
    setIsLoading(true);
    axios.post(`${BACKEND_URL}/api/v1/users/register`,data)
    .then((resp) => {
      const token = resp.data.token;
      if(token){
        localStorage.setItem("authToken" , token);
        toast.success("Registerd");
        navigate('/login');
      }
    })
    .catch((error)=>{
      toast.error(error);
    })
    .finally(()=>{
      setIsLoading(false);
    })
    
  }
  return (
    <div className='flex items-center justify-center mt-[-70px] h-screen '>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Create A New Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input 
            id="name" 
            {...register('name')} 
            placeholder="samrat saha " />
            {errors.name  && 
              <p className="text-red-500">
                {typeof errors.name.message === 'string'
                  ? errors.name.message
                  : 'Please Enter Your Name.'}
              </p>
            }
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email"  
            
            {...register('email')} placeholder="abc@gamil.com" />
            {errors.email  && 
              <p className="text-red-500">
                {typeof errors.email.message === 'string'
                  ? errors.email.message
                  : 'Please Enter Your Email.'}
              </p>
            }
          </div>
          <div className="space-y-1">
            <Label htmlFor="phono">Phone Number</Label>
            <Input 
            id="phno"
            
            {...register('phno')} 
            />
            {errors.phno  && 
            <p className="text-red-500">
                {typeof errors.phno.message === 'string'
                  ? errors.phno.message
                  : 'Please Enter Your Phone Number.'}
              </p>
            }
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input 
            id="password"             
            type='password'
            {...register('password')} 
            />
            {errors.password  && 
            <p className="text-red-500">
                {typeof errors.password.message === 'string'
                  ? errors.password.message
                  : 'Please Enter A valid password.'}
              </p>
            }
          </div>
        </CardContent>
        <CardFooter>
          <Button 
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className='w-full'>Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpPage
