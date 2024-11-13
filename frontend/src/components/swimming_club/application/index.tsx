import  { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import SwimmingApplicationForm from './SwimmingApplicationForm';
import { useNavigate } from 'react-router-dom';
import Confirmation from './ConfirMation';
import axios from 'axios';
import { BACKEND_URL } from '@/config';



const SwimmingApplicationProcess= ({clubId}:{clubId:string}) => {
  const navigate = useNavigate();
  const [currentStep ,setCurrentStep]  =useState<Number>(0);
  const [formData, setFormData] = useState<any>({});

  const handleDataUpdate  = (data:any) =>{
   setFormData((prevData:any) =>({
     ...prevData,
     ...data,
   }))
  }
  const handleSubmit = async() =>{
    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/applications/add/${clubId}`, {data:formData},{
        headers:{
          Authorization:"Bearer " + localStorage.getItem("authToken"),
        }
      });
      console.log('Submission successful:', response.data);
      navigate('/user-dashboard');
    }catch(error){
      console.error('Error during submission:', error);
    }
  }
  return (
    <>
     {currentStep === 0 && < SwimmingApplicationForm 
     setCurrentStep = {setCurrentStep}
     onDatatUpdate = {handleDataUpdate }
     />}
     {currentStep === 1 && <DocumentUpload 
     setCurrentStep = {setCurrentStep}
     onDataUpdate = {handleDataUpdate}
     />}
     {currentStep ===2 && <Confirmation
     onConfirm  = {() => {
      handleSubmit();
      navigate("/user-dashboard")
     }}
     />}
    </>
    
  );
};

export default SwimmingApplicationProcess;