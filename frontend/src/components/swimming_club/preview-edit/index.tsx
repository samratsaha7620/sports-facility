import { PDFDownloadLink } from "@react-pdf/renderer";
import MembershipPDF, { UserData } from "./MembershipData";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";


const SwimmingReviewEditProcess = () => {
  const [data ,setData]  =useState<UserData| null>(null);
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

  return (
    <div>
      {data? 
      <PDFDownloadLink document={<MembershipPDF data={data} />} fileName="membership.pdf">
        <div>
          <span>
            <Button>
            Download Your Application Form Details
            </Button>
          </span>
        </div>
      </PDFDownloadLink>
      :
      (
        <div>Loading...</div>
      )
      }
      
    </div>
  )
}

export default SwimmingReviewEditProcess;
