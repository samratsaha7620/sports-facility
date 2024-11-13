import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Users } from 'lucide-react';

interface Application {
  id: number;
  name: string;
  club: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  statement: string;
}

const AdminApplicationManager = () => {
  const [applications, setApplications] = useState<Application[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      club: 'Debate Society', 
      status: 'pending',
      date: '2024-03-15',
      statement: 'I have experience in public speaking and would love to improve my skills.'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      club: 'Robotics Club', 
      status: 'pending',
      date: '2024-03-14',
      statement: 'I have worked on several Arduino projects and am passionate about robotics.'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      club: 'Chess Club', 
      status: 'approved',
      date: '2024-03-13',
      statement: 'I have been playing chess for 5 years and would love to join the club.'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      club: 'Debate Society', 
      status: 'pending',
      date: '2024-03-12',
      statement: 'I want to improve my critical thinking and argumentation skills.'
    },
    { 
      id: 5, 
      name: 'Tom Brown', 
      club: 'Robotics Club', 
      status: 'rejected',
      date: '2024-03-11',
      statement: 'I am interested in learning about robotics and programming.'
    }
  ]);

  const [expandedClub, setExpandedClub] = useState<string | null>(null);

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
    setApplications(applications.map(app => 
      app.id === id ? {...app, status: newStatus} : app
    ));
  };

  // Group applications by club
  const applicationsByClub = applications.reduce((acc, app) => {
    if (!acc[app.club]) {
      acc[app.club] = [];
    }
    acc[app.club].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6 px-10 mt-6">
      <h2 className="text-3xl font-bold text-gray-800">Manage Applications</h2>
      
      <div className="space-y-4">
        {Object.entries(applicationsByClub).map(([clubName, clubApplications]) => (
          <div key={clubName} className="bg-white rounded-lg shadow">
            <button
              onClick={() => setExpandedClub(expandedClub === clubName ? null : clubName)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Users className="text-gray-500" size={20} />
                <h3 className="text-xl font-semibold text-gray-800">
                  {clubName}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {clubApplications.length} applications
                </span>
              </div>
              {expandedClub === clubName ? (
                <ChevronUp className="text-gray-500" size={20} />
              ) : (
                <ChevronDown className="text-gray-500" size={20} />
              )}
            </button>

            {expandedClub === clubName && (
              <div className="px-6 pb-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Applicant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statement</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clubApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{app.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(app.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div className="max-w-xs truncate">{app.statement}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {app.status === 'pending' && (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleStatusChange(app.id, 'approved')}
                                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                  title="Approve"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(app.id, 'rejected')}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Reject"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApplicationManager;