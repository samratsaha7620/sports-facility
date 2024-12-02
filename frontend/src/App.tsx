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
import FinalSubmission from './components/swimming_club/preview-edit/FinalSubmission'
import ProtectedRoute from './components/ProtectedRoute'
import { Suspense } from 'react'
import ManageClubMembers from './pages/ManageClubMembers'
import SubmittedApplicationPreview from './pages/SubmittedApplicationPreview'
import ReviewEditProcess from './components/ReviewEditProcess'
import ApplicationFinalSubmission from './components/ApplicationFinalSubmission'
import AdminEventsManager from './pages/AdminEventsManager'


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
          <Route path='/:clubName/application/:applicationId'element={<ReviewEditProcess/>}/>
          <Route path='/swimming/application/:applicationId/final/submission' element={<FinalSubmission/>}/>
          <Route path='/:clubName/application/:applicationId/final/submission' element={<ApplicationFinalSubmission/>}/>
          <Route path='/:clubId/application/:applicationId/submission/preview' element={
            <ProtectedRoute allowedRoles={["ADMIN","STUDENT"]}>
              <SubmittedApplicationPreview/>
            </ProtectedRoute>
          }/>
          <Route path='/application' element={<Swimming/>}/>


          <Route path='/user-dashboard' element={
              <UserDashBoard/>           
            }/>

          <Route path='/admin-dashboard' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashBoard/>
            </ProtectedRoute>
            }/>

          <Route path='/admin/events' element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminEventsManager/>
            </ProtectedRoute>
            }/>

          <Route path='/admin/manage-applications' element={
           <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageApplications/>
           </ProtectedRoute>  
          }/>
          
          <Route path='/admin/manage/members' element={
           <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageClubMembers/>
           </ProtectedRoute>  
          }/>

          <Route path='admin/:clubId/applications' element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminApplicationManager/>
                </ProtectedRoute> 
              </Suspense>
          }/>
          
      </Routes>
    </div>
  )
}

export default App



