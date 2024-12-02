import { FaExclamationCircle } from 'react-icons/fa'; // Import an icon from react-icons
import { BACKEND_URL } from '@/config';
import { submittedApplicationsDataAtom, SubmittedApplicationsData } from '@/recoil';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Send, Users } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MembershipPDF, { GymUserData } from '../gym_club/preview_edit/MembershipData';
import { Button } from '../ui/button';


const SubmittedApplications = () => {
  const [submittedApplicationData , setSubmittedApplicationData ]= useRecoilState<SubmittedApplicationsData[]>(submittedApplicationsDataAtom);
  useEffect(()=>{
    const fetchData = async() =>{
      const response = await axios.get<SubmittedApplicationsData[]>(`${BACKEND_URL}/api/v1/applications/submitted`,{
        headers:{
          Authorization:"Bearer "+localStorage.getItem("authToken"),
        }
      })
      setSubmittedApplicationData(response.data);
    }
    fetchData();
  },[])
  
  if(submittedApplicationData.length === 0){
    return(
      <div className="flex flex-col items-center justify-center mt-5 space-y-4 p-3 m-5 border border-slate-400 rounded-lg">
      <FaExclamationCircle className="text-4xl text-gray-500" /> {/* Icon */}
      <h2 className="text-lg font-semibold text-gray-800">
       There are no Submitted applications available.
      </h2>
    </div>
    )
  }
  return (
    <div className="space-y-6 mt-5">
      <div className="grid gap-6 md:grid-cols-2">
        {submittedApplicationData.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-600"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{club.clubName}</h3>
              <span className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-1" />
                Application Date: {new Date(club.updatedAt).toLocaleDateString()} 
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to={`/${club.clubId}/application/${club.id}/submission/preview`
                }
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Send size={16} className="mr-2" />
                View Application Details
              </Link>
              <PDFDownloadLink
              document={isGymUserData(club.data) ? <MembershipPDF data={club.data} /> : <div>Error: Invalid data</div>}
              fileName="membership.pdf"
              >
                <Button className=" bg-gray-600 text-white  hover:bg-slate-700 transition duration-200">
                  Download Your Application Form
                </Button>
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function isGymUserData(data: any): data is GymUserData {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0].choiceOfDiscipline === "object" &&
    Array.isArray(data[0].choiceOfDiscipline) &&
    typeof data[0].name === "string" &&
    typeof data[0].sexType === "number" &&
    typeof data[0].dob === "string" &&
    typeof data[0].rollno === "string" &&
    typeof data[0].semester === "string" &&
    typeof data[0].dept === "string"
  );
}

export default SubmittedApplications
