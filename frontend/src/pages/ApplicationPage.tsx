import { RocketIcon } from "@radix-ui/react-icons"
 import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import {Link, useParams } from "react-router-dom"
import SwimmingApplicationProcess from "@/components/swimming_club/application";

const ApplicationPage = () => {
  const [clubName,setClubName] = useState<string>("");
  const [isApplied , setIsApplied]  =useState<boolean>(false); 
  const [isLoading ,setIsLoading] = useState<boolean>(true);

  const {clubId} = useParams();

  useEffect(() =>{
    const fetchDetails = async() =>{
      try{
        const response = await axios.get(`${BACKEND_URL}/api/v1/clubs/${clubId}/applicants`,{
          headers:{
            Authorization:"Bearer "+localStorage.getItem("authToken")
          }
        });
        setClubName(response.data.name);
        setIsApplied(response.data.isApplied);
        setIsLoading(false);
      }catch(error){
        console.log('Error fetching Club Details..',error);
      }
    }
    fetchDetails();
  },[clubId])

  if (isLoading) return <div>Loading...</div>;

  if(isApplied){
    return(
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You have already Submitted the application.please    
          <span className="underline" >
            <Link to={"/user-dashboard"}>
              Go Back To Your Dashboard
            </Link>
            </span>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <>
      {clubName === "Swimming & water sports Club" && clubId && <SwimmingApplicationProcess clubId= {clubId}/>}
    </>
  )
}

export default ApplicationPage
