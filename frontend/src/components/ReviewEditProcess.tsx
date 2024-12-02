import { useParams } from 'react-router-dom'
import GymReviewEditProcess from './gym_club/preview_edit';
import ClubsReviewEditProcess from './other_clubs/preview_edit';

const ReviewEditProcess = () => {
  const {clubName,applicationId} = useParams();
  return (
    <div>
      {clubName ===  "Gymnasium Club" && applicationId && <GymReviewEditProcess applicationId={applicationId}/>}
      {clubName !==  "Gymnasium Club" && applicationId && <ClubsReviewEditProcess applicationId={applicationId}/>}
    </div>
  )
}

export default ReviewEditProcess
