import React, { useEffect, useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { Button } from './components/ui/button';
import { Link } from 'react-router-dom'; 
import logo from './tulogo.png';
import { useRecoilState } from 'recoil';
import { userAuthState } from './recoil';

interface NavItemPropsType {
   label: string;
   linkto: string;
}

function NavItem({ label,linkto }: NavItemPropsType) {
    return (
        <Link to={linkto} className=" p-1 font-medium text-gray-700 hover:text-neutral-900">{label}</Link>
    );
}

function NavList() {
    return (
      <ul className="mb-4 mt-2 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
        <NavItem label="Home" linkto='/'/>
        <NavItem label="Events" linkto='/events'/>
        <NavItem label="Gallery" linkto='/gallery' />
        <NavItem label="Clubs" linkto='/clubs' />
        <NavItem label="Contacts" linkto='/contacts' />
      </ul>
    );
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [userState,setUserState] = useRecoilState(userAuthState)
    const handleOpen = () => setOpen((cur) => !cur);

    useEffect(() => {
        window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpen(false)
        );
    }, []);

    return (
        <nav className="bg-transparent w-full border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between p-4 text-gray-900 px-10">               
                <div>
                    <Link to="/">
                        <img width ={50} src={logo}/>
                    </Link>
                    
                </div>

                <div className="hidden lg:block">
                    <NavList/>
                </div>

                <div className="hidden lg:inline-block bg-gray-2 ">
                    {userState.isAuthenticated ?(
                        <div className='flex justify-center align-items-center gap-9'>
                            <Avatar className='cursor-pointer' onClick={() => navigate("/user-dashboard")}>
                                <AvatarImage src="/public/avatar.png" alt="@shadcn" />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                            <Button
                            className='w-full'
                            variant="outline"
                            onClick={() =>{
                                setUserState((prevState: any) => ({
                                    ...prevState,
                                    isAuthenticated:false,
                                    userId: "",
                                    }))
                                    localStorage.removeItem("authToken");
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    ) :(
                        <div className='space-x-4'>
                            <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
                        </div>
                        
                    )}                    
                </div>

                <button 
                    onClick={handleOpen}
                    className='ml-auto inline-block lg:hidden text-gray-700 '
                >
                    {open ? (
                        <MdClose className='h-6 w-6'/>
                    ) :(
                        <GiHamburgerMenu className='h-6 w-6'/>
                    )} 
                </button>
                                  
            </div>
            {open && (
                <div className='lg:hidden'>
                    <div className='mt-2 bg-white py-2 px-4 rounded-lg shadow-lg'>
                        <NavList/>
                        {userState.isAuthenticated ?(
                            <div>
                                <Button
                                className='w-full'
                                variant="outline"
                                onClick={() =>{
                                    setUserState((prevState: any) => ({
                                        ...prevState,
                                        isAuthenticated:false,
                                        userId: "",
                                        }))
                                        localStorage.removeItem("authToken");
                                    }}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) :(
                            <>
                                <div className='pb-3'>
                                    <Button className='w-full'variant="outline" onClick={() => {
                                        handleOpen()
                                        navigate('/login')}}>
                                        Login
                                    </Button>
                                </div>
                                <div>
                                    <Button 
                                    className="w-full" onClick={() =>{ 
                                        handleOpen()
                                        navigate('/signup')}}>
                                        Sign Up
                                    </Button>
                                </div>
                            </>
                        )}
                        
                    </div>
                </div>
            )}    
        </nav>
    );
};

export default Navbar;