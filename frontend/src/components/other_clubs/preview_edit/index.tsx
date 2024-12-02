import { GymUserData } from "./MembershipData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";



const ClubsReviewEditProcess = ({applicationId}:{applicationId:string}) => {
  const {clubName} = useParams();
  const [data ,setData]  =useState<GymUserData| null>(null);
  const navigate = useNavigate();
  
  useEffect(() =>{
    const fetchData =  async() =>{
      const response = await axios.get<GymUserData>(`${BACKEND_URL}/api/v1/applications/${applicationId}/`,{
        headers:{
          Authorization:"Bearer "+localStorage.getItem("authToken"),
        }
      })
      
      //@ts-ignore
      setData(response.data.data)
    }

    fetchData();
  },[applicationId])

  const handleEdit = () => {
    navigate(`/applications/${applicationId}/edit`);
  };

  const handleSaveAndContinue = () => {
    navigate(`/${clubName}/application/${applicationId}/final/submission`,{
      state: { applicationData: data }
    });
  };

  return (
    <div>
      {data ? (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 border border-slate-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Application Review</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Choice Of Disclipline:</span>
              <span className="text-gray-900">
              {Array.isArray(data[0].choiceOfDiscipline) 
              ? data[0].choiceOfDiscipline.join(', ') 
              : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{data[0].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Sex:</span>
              <span className="text-gray-900">{data[0].sexType === 1 ? "Male" : "Female"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <span className="text-gray-900">{new Date(data[0].dob).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">
                Roll No:
              </span>
              <span className="text-gray-900">{data[0].rollno}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">
                Semester:
              </span>
              <span className="text-gray-900">{data[0].semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-900">{data[0].dept}</span>
            </div>

            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Dcummets</h3>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  ID Card
                  <a 
                  href={data[1].myFilePath} target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-4" 
                  > 
                  Click Here To See The ID Card
                  </a>
                </span>               
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Passport Size Photo
                  <a 
                  href={data[2].myFilePath} target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-4" 
                  > 
                  click here to see the Passport Size Photo
                  </a>
                </span>
              </div>
            </div>            

          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="default" onClick={handleSaveAndContinue}>
              Save and Continue
            </Button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default ClubsReviewEditProcess;
