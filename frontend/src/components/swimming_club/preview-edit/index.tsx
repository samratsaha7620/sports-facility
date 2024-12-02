import { UserData } from "./MembershipData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";



const SwimmingReviewEditProcess = () => {
  const [data ,setData]  =useState<UserData| null>(null);
  const navigate = useNavigate();
  const {applicationId} = useParams();
  
  useEffect(() =>{
    const fetchData =  async() =>{
      const response = await axios.get<UserData>(`${BACKEND_URL}/api/v1/applications/${applicationId}/`,{
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
    navigate(`/swimming/application/${applicationId}/final/submission`,{
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
              <span className="font-medium text-gray-700">Membership Category:</span>
              <span className="text-gray-900">{data[0].membershipCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Membership Type:</span>
              <span className="text-gray-900">{data[0].membershipType}</span>
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
                {data[0].rollno ? "Roll No:" : "Employee Code:"}
              </span>
              <span className="text-gray-900">{data[0].rollno || data[0].emp_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">
                {data[0].semester ? "Semester:" : "Designation:"}
              </span>
              <span className="text-gray-900">{data[0].semester || data[0].designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-900">{data[0].dept}</span>
            </div>

            {data[0].localGuardian && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Local Guardian Details</h3>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name and Address:</span>
                  <span className="text-gray-900">{data[0].localGuardian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-900">{data[0].local_contact}</span>
                </div>
              </div>
            )}
            {/* Additional Information */}
            {data[0].relativeName && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Information</h3>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    {data[0].membershipCategory === "TU Employee Child"
                      ? "Name of Child:"
                      : data[0].membershipCategory === "TU Employee Dependent"
                      ? "Name of Dependent:"
                      : "Name of Other Relative:"}
                  </span>
                  <span className="text-gray-900">{data[0].relativeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Relation with Employee:</span>
                  <span className="text-gray-900">{data[0].relationWithEmployee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Residing Since:</span>
                  <span className="text-gray-900">
                    {data[0].residingSince
                      ? new Date(data[0].residingSince).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Membership Period:</span>
                  <span className="text-gray-900">
                    From {data[0].membershipFrom ? new Date(data[0].membershipFrom).toLocaleDateString() : "Not available"} to{" "}
                    {data[0].membershipTo ? new Date(data[0].membershipTo).toLocaleDateString() : "Not available"}
                  </span>
                </div>
              </div>
            )}
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
                  Birth Certificate
                  <a 
                  href={data[2].myFilePath} target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-4" 
                  > 
                  click here to see the Birth Certificate
                  </a>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Passport Size Photo
                  <a 
                  href={data[3].myFilePath} target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-4" 
                  > 
                  click here to see the Passport Size Photo
                  </a>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Proof Of Residence
                  <a 
                  href={data[4].myFilePath} target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-4" 
                  > 
                  click here to see the  Proof Of Residence
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

export default SwimmingReviewEditProcess;
