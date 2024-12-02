import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from 'zod';
import axios from "axios";
import { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_URL } from '@/config';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "@/recoil";

const FormSchema = z.object({
  email: z.string()
    .email("This is not a valid email.")
    .refine((val) => val.endsWith("@tezu.ac.in"), {
      message: "Email must end with @tezu.ac.in.Enter Your G-Suite email id",
    }),
  password: z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormInput = z.infer<typeof FormSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  const setUserState = useSetRecoilState(userAuthState)
  const [activeTab, setActiveTab] = useState("user");
  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm<FormInput>({
    resolver:zodResolver(FormSchema),
    defaultValues:{
      email:"",
      password:""
    }
  })

  const onSubmit:SubmitHandler<FormInput> = async(data) =>{
    setIsLoading(true);
    const apiUrl = activeTab === "user" ? `${BACKEND_URL}/api/v1/users/login` :
    `${BACKEND_URL}/api/v1/admin/login`;

    try {
      const resp = await axios.post(apiUrl, data);
      const token = resp.data.token;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", resp.data.user.type);

        setUserState(({prevState}:{prevState:{}}) => ({
          ...prevState,
          isAuthenticated: true,
          userId: resp.data.user.id,
          userType: resp.data.user.type,
        }));

        toast.success("Login successful");

        if (resp.data.user.type === "STUDENT") {
          navigate("/user-dashboard");
        } else if(resp.data.user.type === "ADMIN"){
          navigate("/admin-dashboard");
        }
      } else {
        throw new Error("Token is missing in the response.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    } 
  }
  return (
    <div className='flex mt-[-70px] h-screen items-center justify-center'>
      <Tabs 
      defaultValue="user" 
      onValueChange={setActiveTab}
      className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 border border-gray-700 bg-neutral-800">
          <TabsTrigger  className="text-white hover:text-gray-500 transition duration-200" value="user">User</TabsTrigger>
          <TabsTrigger className="text-white hover:text-gray-500 transition duration-200" value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card className="border border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">Login Into Your Account</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                {...register("email")}
                id="email" 
                placeholder="abc@tezu.ac.in"
                className="border border-gray-500"
                />
                {errors.email && <span className="text-red-600">{errors.email.message}</span>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                {...register("password")} 
                id="password" 
                type="password"
                className="border border-gray-500"
                placeholder="Enter your password" />
                {errors.password && <span className="text-red-600">{errors.password.message}</span>}
              </div>
            </CardContent>

            <CardFooter>
              <Button
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              >
                {isLoading ? "Loggin in...":"Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="border border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">Admin Use Only</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                  <Input 
                  {...register("email")}
                  id="email" 
                  placeholder="abc@tezu.ac.in" />
                  {errors.email && <span>{errors.email.message}</span>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                  <Input
                  {...register("password")} 
                  id="password" 
                  type="password"
                  placeholder="Enter your password" />
                  {errors.password && <span>{errors.password.message}</span>}
              </div>
            </CardContent>
            <CardFooter>
              <Button
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              >
                {isLoading ? "Loggin in...":"Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LoginPage
