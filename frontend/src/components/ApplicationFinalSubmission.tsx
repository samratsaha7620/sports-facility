import { useParams } from "react-router-dom";
import FinalSubmission from "./gym_club/preview_edit/FinalSubmission";

const ApplicationFinalSubmission = () => {
  const {clubName,applicationId} = useParams();
  return (
    <div>
      {clubName ===  "Gymnasium Club" && applicationId && <FinalSubmission applicationId={applicationId}/>}
    </div>
  )
}

export default ApplicationFinalSubmission
