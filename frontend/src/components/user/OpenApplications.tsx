import { Users,  Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { AvailableClubs, availableClubsDataAtom } from '@/recoil';
import { useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

const OpenApplications = () => {
  const [availableClubsData , setAvailableClubsData ]= useRecoilState<AvailableClubs[]>(availableClubsDataAtom);
  const navigate = useNavigate();

  useEffect(() =>{
    const fetchData = async () =>{
      try{
        const response = await axios.get<AvailableClubs[]>(`${BACKEND_URL}/api/v1/applications/availableClubs`);
        setAvailableClubsData(response.data);
      }catch(error){
        console.log('Error fetching Club Details..',error);
      }
    }
    fetchData();
  },[])
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {availableClubsData.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{club.name}</h3>
              <span className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-1" />
                Application Open From: {new Date(club.publishStartDate).toLocaleDateString()} 
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{club.description}</p>
            

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Deadline: {new Date(club.publishEndDate).toLocaleDateString()}
              </span>
              <Button
                onClick={() => {
                  if(club.name === "Swimming & water sports Club"){
                    navigate(`/${club.id}/application`)
                  }else {
                    navigate('/user-dashboard')
                  }
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Send size={16} className="mr-2" />
                Apply Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenApplications;