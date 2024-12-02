import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Users, Calendar, FileText, CreditCard } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userAuthState } from '@/recoil';
import toast from 'react-hot-toast';

const AdminDashboard = () => {

  const [userState]  = useRecoilState(userAuthState);
  
  if(!userState.isAuthenticated || userState.userType !== "ADMIN"){
    toast.error("Please Login into Your Account..")
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen px-10 mt-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <DashboardCard
          title="Manage Clubs"
          description="Add, edit, or remove clubs, manage photos and details"
          icon={<Users className = "text-blue-500" size={24} />}
          link="/admin/clubs"
        />
        <DashboardCard
          title="Manage Events"
          description="Create and manage club events"
          icon={<Calendar className="text-green-500" size={24} />}
          link="/admin/events"
        />
        <DashboardCard
          title="Manage Club Applications"
          description="Publish, review and process club applications"
          icon={<FileText className="text-yellow-500" size={24} />}
          link="/admin/manage-applications"
        />
        <DashboardCard
          title="Manage Payments and Club Members"
          description="mage club members and handle payments"
          icon={<CreditCard  className="text-red-500" size={24} />}
          link="/admin/manage/members"
        />
      </div>
    </div>
  );
  
};

const DashboardCard = ({ title, description, icon, link }:{
  title:string,
  description:string ,
  icon:React.ReactNode,
  link:string,
}) => (
  <Link to={link} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-600">
    <div className="flex justify-between items-center mb-4 ">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default AdminDashboard;