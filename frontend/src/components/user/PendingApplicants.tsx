
import { BACKEND_URL } from '@/config';
import { PendingApplicationsData, pendingApplicationsDataAtom } from '@/recoil';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Send, Users } from 'lucide-react';

const PendingApplicants = () => {
  const [pendingClubsData , setPendingClubsData ]= useRecoilState<PendingApplicationsData[]>(pendingApplicationsDataAtom);
  useEffect(()=>{
    const fetchData = async() =>{
      const response = await axios.get<PendingApplicationsData[]>(`${BACKEND_URL}/api/v1/applications/pending`,{
        headers:{
          Authorization:"Bearer "+localStorage.getItem("authToken"),
        }
      })
      setPendingClubsData(response.data);
    }
    fetchData();
  },[])
  console.log(pendingClubsData);
  
  
  return (
    <div className="space-y-6 mt-5">
      <div className="grid gap-6 md:grid-cols-2">
        {pendingClubsData.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{club.clubName}</h3>
              <span className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-1" />
                Application Date: {new Date(club.createdAt).toLocaleDateString()} 
              </span>
            </div>
            
            
            

            <div className="flex justify-between items-center">
              <Link
                to={`/swimming/application/${club.id}`
                }
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Send size={16} className="mr-2" />
                Complete Application
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingApplicants
