import PublishControl from '@/components/admin/PublishControl';
import { BACKEND_URL } from '@/config';
import { clubApplicationDataAtom, ClubsApplicationDetails } from '@/recoil';
import axios from 'axios';
import { CheckCircle, Users } from 'lucide-react';
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const ManageApplications = () => {
  const [clubsData , setClubsData ]= useRecoilState<ClubsApplicationDetails[]>(clubApplicationDataAtom);

  useEffect(() =>{
    const fetchClubsData = async () =>{
      try{
        const response = await axios.get<ClubsApplicationDetails[]>(`${BACKEND_URL}/api/v1/clubs/details`);
        setClubsData(response.data);
        
      }catch(error){
        console.log('Error fetching Club Details..',error);
      }
    }
    fetchClubsData();  
  },[])

  return (
    <div className="bg-white px-10 text-center p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">Club Applications Status</h3>
      <div className="space-y-4">
      {clubsData.map((club) => (
        <div key={club.id} className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-slate-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users size={20} className="text-gray-500" />
              <Link to={`/admin/${club.id}/applications`}>
                <span className="font-medium text-gray-800">{club.name}</span>
              </Link>
              {club.isPublished && (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Published
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {club.applicationCount} {club.applicationCount > 1 ? "Applications" : "Application"}
                  </span>
                </>
              )}
            </div>
            <PublishControl clubId={club.id} initialStatus={club.isPublished} />
          </div>

          {/* Show warning message below club name */}
          {club.isPublished && club.publishEndDate && new Date(club.publishEndDate) < new Date() && (
            <div className="mt-2 text-sm text-red-600 ">
              Please unpublish the form. Application deadline has passed.
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  )
}

export default ManageApplications
