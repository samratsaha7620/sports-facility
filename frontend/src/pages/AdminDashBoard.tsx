import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, FileText } from 'lucide-react';

const AdminDashboard = () => {

  return (
    <div className="h-screen px-10 mt-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Manage Clubs"
          description="Add, edit, or remove clubs, manage photos and details"
          icon={<Users className="text-blue-500" size={24} />}
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
  <Link to={link} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default AdminDashboard;