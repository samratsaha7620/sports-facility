import React from 'react';
import { Clock, CheckCircle, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OpenApplications from '@/components/user/OpenApplications';
import PendingApplicants from '@/components/user/PendingApplicants';
import { useRecoilState } from 'recoil';
import { userAuthState } from '@/recoil';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';


interface Membership {
  id: number;
  clubName: string;
  joinDate: string;
  status: string;
  nextPayment: string;
  fee: number;
  activities: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

interface Application {
  id: number;
  clubName: string;
  appliedDate: string;
  status: string;
  details: {
    statement: string;
    requirements: string[];
  };
  timeline: Array<{
    date: string;
    status: string;
    note: string;
  }>;
}

const userMemberships: Membership[] = [
  { 
    id: 1, 
    clubName: 'Debate Society', 
    joinDate: '2023-01-15', 
    status: 'active',
    nextPayment: '2024-01-15',
    fee: 25,
    activities: [
      { date: '2023-12-01', type: 'Event Participation', description: 'Winter Debate Championship' },
      { date: '2023-11-15', type: 'Payment', description: 'Monthly membership fee processed' },
      { date: '2023-11-01', type: 'Achievement', description: 'Best Speaker Award' }
    ]
  },
  { 
    id: 2, 
    clubName: 'Chess Club', 
    joinDate: '2023-03-20', 
    status: 'pending-payment',
    nextPayment: '2023-12-20',
    fee: 15,
    activities: [
      { date: '2023-11-20', type: 'Tournament', description: 'Participated in Fall Chess Tournament' },
      { date: '2023-11-10', type: 'Training', description: 'Advanced Strategy Workshop' }
    ]
  }
];

const pendingApplications: Application[] = [
  { 
    id: 1, 
    clubName: 'Robotics Club', 
    appliedDate: '2023-11-30', 
    status: 'pending',
    details: {
      statement: 'I have experience in Arduino programming and would love to contribute to the robotics projects.',
      requirements: ['Basic programming knowledge', 'Available for weekly meetings', 'Interest in robotics'],
    },
    timeline: [
      { date: '2023-11-30', status: 'submitted', note: 'Application submitted successfully' },
      { date: '2023-12-01', status: 'under-review', note: 'Application under initial review' }
    ]
  },
  { 
    id: 2, 
    clubName: 'Photography Club', 
    appliedDate: '2023-12-05', 
    status: 'under-review',
    details: {
      statement: 'Photography has been my passion for 3 years, and I would love to learn from other enthusiasts.',
      requirements: ['Own camera', 'Basic photography knowledge', 'Portfolio submission'],
    },
    timeline: [
      { date: '2023-12-05', status: 'submitted', note: 'Application submitted successfully' },
      { date: '2023-12-06', status: 'under-review', note: 'Portfolio review in progress' }
    ]
  }
];

const UserDashboard = () => {
  const [userState]  = useRecoilState(userAuthState);
  
  if(!userState.isAuthenticated){
    toast.error("Please Login into Your Account..")
    return <Navigate to="/" replace />;
  }
  return (
    <div className="space-y-6 px-10 mt-6 ">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">My Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Memberships"
          value={userMemberships.filter(m => m.status === 'active').length.toString()}
          icon={<CheckCircle className="text-green-500" size={24} />}
        />
        <DashboardCard
          title="Pending Applications"
          value={pendingApplications.length.toString()}
          icon={<Clock className="text-yellow-500" size={24} />}
        />
        <DashboardCard
          title="Available Clubs"
          value="8"
          icon={<Send className="text-blue-500" size={24} />}
        />
      </div>
      
      <div className='bg-white shadow-rounded-lg'>
        <div className='border-b'>
        <Tabs defaultValue="memberships" className="w-full">
          <TabsList>
            <TabsTrigger className='mr-5' value="memberships" >My Memberships</TabsTrigger>
            <TabsTrigger className='mr-5' value="open" >Open applications</TabsTrigger>
            <TabsTrigger className='mr-5' value="pending" >Pending Applications</TabsTrigger>
            <TabsTrigger className='mr-5' value="submitted">Submitted Applications</TabsTrigger>
            
          </TabsList>
          <TabsContent value="memberships">Make changes to your account here.</TabsContent>
          <TabsContent value="open"><OpenApplications /></TabsContent>
          <TabsContent value="pending"><PendingApplicants/></TabsContent>
          <TabsContent value="submitted">Change your password here.</TabsContent>

        </Tabs>

        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

export default UserDashboard;