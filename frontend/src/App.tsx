import './App.css'
import { Routes,Route } from 'react-router-dom'
import Swimming from './Swimming'
import Navbar from './Navbar'
import Home from './pages/Home'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contacts from './pages/Contacts'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import UserDashBoard from './pages/UserDashBoard'
import ClubList from './ClubList'
import AdminDashBoard from './pages/AdminDashBoard'
import ManageApplications from './pages/ManageApplications'
import AdminApplicationManager from './components/admin/AdminApplicationManager'
import Upload from './pages/Upload'
import ApplicationPage from './pages/ApplicationPage'
import SwimmingReviewEditProcess from './components/swimming_club/preview-edit'


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/clubs" element={<ClubList />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path='/upload' element={<Upload/>}/>

          
          
          <Route path="/:clubId/application" element={<ApplicationPage />} />
          <Route path='/swimming/application/:applicationId'element={<SwimmingReviewEditProcess/>}/>
          <Route path='/application' element={<Swimming/>}/>
          <Route path='/user-dashboard' element={<UserDashBoard/>}/>
          <Route path='/admin-dashboard' element={<AdminDashBoard/>}/>
          <Route path='/admin/manage-applications' element={<ManageApplications/>}/>
          <Route path='admin/:clubId/applications' element={<AdminApplicationManager/>}/>
      </Routes>
    </div>
  )
}

export default App



// const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? (
//     <Route path={path} element={element} />
//   ) : (
//     <Redirect to="/login" />
//   );
// };

