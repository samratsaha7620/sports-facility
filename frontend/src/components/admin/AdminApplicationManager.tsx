import { Check, X, Users, Key } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Applications } from '@/recoil';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface clubProps {
  id: string;
  name: string;
  isApplicationPublished: boolean,
  publishStartDate: Date,
  publishEndDate:Date
};
type ClubState = clubProps;

const dateSchema = z.object({
  endDate: z.string().refine(
    (date) => new Date(date) >= new Date(),
    {message:"End date cannot be before today."}
  )
})

type DateFormData = z.infer<typeof dateSchema>;

const AdminApplicationManager = () => {
  const navigate = useNavigate();

  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedApplications, setSubmittedApplications] = useState<Applications>([]);
  const [acceptedApplications, setAcceptedApplications] = useState<Applications>([]);
  const [rejectedApplications, setRejectedApplications] = useState<Applications>([]);

  const [dialogStates, setDialogStates] = useState<
    Record<string, { isAcceptDialogOpen: boolean; isRejectDialogOpen: boolean }>
  >({});

  const [membershipDialogStates,setMembershipDialogStates] = useState<Record<string,{isMemberShipDialogopen:boolean}>>({});

  const [club, setClub] = useState<ClubState>();
  const { clubId } = useParams<{ clubId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, formState: { errors } } = useForm<DateFormData>({
    resolver: zodResolver(dateSchema),
    defaultValues: { endDate: today },
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/clubs/${clubId}/applications`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          }
        );

        setSubmittedApplications(res.data.submittedApplications);
        setAcceptedApplications(res.data.acceptedApplications);
        setRejectedApplications(res.data.rejectedApplications);
        setClub(res.data.club);

        // Initialize dialog states after applications are fetched
        const initialDialogStates = res.data.submittedApplications.reduce(
          (acc: Record<string, { isAcceptDialogOpen: boolean; isRejectDialogOpen: boolean }>, app: Applications[0]) => {
            acc[app.id] = { isAcceptDialogOpen: false, isRejectDialogOpen: false };
            return acc;
          },
          {}
        );
        setDialogStates(initialDialogStates);

        const initialMembershipDialogStates = res.data.acceptedApplications.reduce((
          acc: Record<string, { isMemberShipDialogopen: boolean}>, app: Applications[0]
        ) =>{
          acc[app.id] = { isMemberShipDialogopen: false};
          return acc;
        })
        setMembershipDialogStates(initialMembershipDialogStates)

      } catch (err: any) {
        setError(err.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [clubId]);

  if (!club || (submittedApplications.length === 0 && rejectedApplications.length === 0 && acceptedApplications.length === 0) ) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        There are no applications to show
      </div>
    );
  }

  const handleStatusChange = async (id: string, status: string) => {
    const application = submittedApplications.find((app) => app.id === id);

    if(!application) return;
    
    setSubmittedApplications((prev) => prev.filter((app) => app.id !== id))

    if (status === "ACCEPTED") {
      setAcceptedApplications((prev) => [...prev, application]);
    } else if (status === "REJECTED") {
      setRejectedApplications((prev) => [...prev, application]);
    }

    const endpoint =
      status === "ACCEPTED"
        ? `${BACKEND_URL}/api/v1/applications/accept/${id}`
        : status === "REJECTED"
        ? `${BACKEND_URL}/api/v1/applications/reject/${id}`
        : null;
    if (!endpoint) return;
    
    try {
      const response = await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );

      if (!response.data) {
        throw new Error(`Failed to update status to ${status}`);
      }

      const updatedApplication = response.data.application;

      setSubmittedApplications((prevApplications: Applications) =>
        prevApplications.map((app) =>
          app.id === updatedApplication.id
            ? { ...app, stage: updatedApplication.stage }
            : app
        )
      );
      navigate(0);
    } catch (error) {
      console.error(`Error updating application ${id} to ${status}:`, error);
      setSubmittedApplications((prev) => [...prev, application]);

      if (status === "accepted") {
        setAcceptedApplications((prev) =>
          prev.filter((app) => app.id !== id)
        );
      } else if (status === "rejected") {
        setRejectedApplications((prev) =>
          prev.filter((app) => app.id !== id)
        );
      }
    }
  };


  const handleMembership = async(id:string ,endDate: string) : Promise<void>=>{
    if (!id ||!endDate) return alert("All fields are required.");
    setLoading(true);
    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/clubs/${clubId}/applications/${id}/member/add`,{
        validFrom:startDate, 
        validTo:endDate
      },{
        headers:{
          Authorization:"Bearer " + localStorage.getItem("authToken"),
        }
      })

      if(response.status === 200){
        setLoading(false);
      }else{
        throw new Error(`Failed to update membership status to ${id}`);
      }
      navigate(0);
    }catch(error){
      console.error(`Error updating membership status to application ${id} `, error);
      setLoading(false);
    }
  }

  const openAcceptDialog = (appId: string) => {
    setDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isAcceptDialogOpen: true },
    }));
  };

  const closeAcceptDialog = (appId: string) => {
    setDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isAcceptDialogOpen: false },
    }));
  };

  const openRejectDialog = (appId: string) => {
    setDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isRejectDialogOpen: true },
    }));
  };

  const closeRejectDialog = (appId: string) => {
    setDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isRejectDialogOpen: false },
    }));
  };

  const openMembershipDialog = (appId: string) => {
    setMembershipDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMemberShipDialogopen: true },
    }));
  };

  const closeMembershipDialog = (appId: string) => {
    setMembershipDialogStates((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMemberShipDialogopen: false },
    }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6 px-10 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage {club.name} Applications</h2>     
      <div className='space-y-4 border border-gray-800 rounded-lg p-4'>
        <div key={club.id} className="bg-white rounded-lg shadow border border-slate-600 p-3">

          {/*submitted applications */}
          <div className="flex items-center space-x-3 px-4 py-6 rounded-lg ">
            <Users className="text-gray-500" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">Submitted Applications</h3>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {submittedApplications.length} {submittedApplications.length > 1 ?"applications":"application"}
            </span>
          </div>

          <div className="px-6 pb-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Applicant Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Data</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="text-gray-900">{app.student.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {app.student.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            app.stage
                          )}`}
                        >
                          {app.stage}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                      <a
                        href={`/${clubId}/application/${app.id}/submission/preview`} // Replace with the actual URL of the application data page
                        target="_blank"
                        rel="noopener noreferrer" // To prevent potential security issues
                        className="max-w-xs truncate cursor-pointer"
                      >
                        Click Here to See Application Data
                      </a>
                      </TableCell>
                      <TableCell className="text-right">
                        {app.stage === "SUBMITTED" && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openAcceptDialog(app.id)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Approve"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => openRejectDialog(app.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Reject"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/*accepted applications */}
        <div className='border border-slate-600 rounded-lg'>
          <div className="flex items-center space-x-3 px-4 py-6 rounded-lg  ">
            <Users className="text-gray-500" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">Accepted Applications</h3>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {acceptedApplications.length} {acceptedApplications.length > 1 ?"applications":"application"}
            </span>
          </div>

          <div className="px-6 pb-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Applicant Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Data</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acceptedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="text-gray-900">{app.student.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {app.student.email}
                      </TableCell>
                      <TableCell>
                      {(app.stage === "ACCEPTED" && app.isMembershipGranted) ? (     
                          <span
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full hover:bg-yellow-200 bg-yellow-100 text-yellow-800"
                          >
                            Member
                          </span>
                            
                          ):<span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            app.stage
                          )}`}
                        >
                          {app.stage}
                        </span>
                      }
                        
                      </TableCell>
                      <TableCell className="text-gray-500">
                      <a
                        href={`/${clubId}/application/${app.id}/submission/preview`} // Replace with the actual URL of the application data page
                        target="_blank"
                        rel="noopener noreferrer" // To prevent potential security issues
                        className="max-w-xs truncate cursor-pointer"
                      >
                        Click Here to See Application Data
                      </a>
                      </TableCell>
                      <TableCell className="text-right">
                        {(app.stage === "ACCEPTED" && !app.isMembershipGranted) &&(
                            <div className="flex  px-5 justify-end space-x-2">
                              <Button
                                onClick={() => openMembershipDialog(app.id)}
                                className="p-1 hover:bg-green-200 bg-green-100 text-green-800"
                              >
                                Grant Membership
                              </Button>
                            </div>
                          )}                          
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/*rejected applications */}
        <div className='border border-slate-600 rounded-lg'>
          <div className="flex items-center space-x-3 px-4 py-6 rounded-lg  ">
            <Users className="text-gray-500" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">Rejected Applications</h3>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {rejectedApplications.length} {rejectedApplications.length > 1 ?"applications":"application"}
            </span>
          </div>

          <div className="px-6 pb-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Applicant Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Data</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="text-gray-900">{app.student.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {app.student.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            app.stage
                          )}`}
                        >
                          {app.stage}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                      <a
                        href={`/${clubId}/application/${app.id}/submission/preview`} // Replace with the actual URL of the application data page
                        target="_blank"
                        rel="noopener noreferrer" // To prevent potential security issues
                        className="max-w-xs truncate cursor-pointer"
                      >
                        Click Here to See Application Data
                      </a>
                      </TableCell>
                      <TableCell className="text-right">
                        {app.stage === "SUBMITTED" && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openAcceptDialog(app.id)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Approve"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => openRejectDialog(app.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Reject"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
      </div>

      {submittedApplications.map((app) => (
        <div key={app.id}>
          {/* Accept Dialog */}
          <Dialog open={dialogStates[app.id]?.isAcceptDialogOpen} onOpenChange={() => closeAcceptDialog(app.id)}>
            <DialogTrigger />
            <DialogContent>
              <DialogTitle>Approve Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this application?
              </DialogDescription>
              <DialogFooter>
                <Button onClick={() => closeAcceptDialog(app.id)}>Cancel</Button>
                <Button
                  onClick={() => {
                    handleStatusChange(app.id, "ACCEPTED");
                    closeAcceptDialog(app.id);
                  }}
                >
                  Yes, Approve
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reject Dialog */}
          <Dialog open={dialogStates[app.id]?.isRejectDialogOpen} onOpenChange={() => closeRejectDialog(app.id)}>
            <DialogTrigger />
            <DialogContent>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this application?
              </DialogDescription>
              <DialogFooter>
                <Button onClick={() => closeRejectDialog(app.id)}>Cancel</Button>
                <Button
                  onClick={() => {
                    handleStatusChange(app.id, "REJECTED");
                    closeRejectDialog(app.id);
                  }}
                >
                  Yes, Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ))}
      
      {acceptedApplications.map((app) =>(
        <div key={app.id}>
          <Dialog open={membershipDialogStates[app.id]?.isMemberShipDialogopen} onOpenChange={() => closeMembershipDialog(app.id)}>
            <DialogTrigger />
            <DialogContent>
              <DialogTitle>Grant Membership</DialogTitle>
              <DialogDescription>
                Are you sure you want to grant this applicant the membership of {club.name}?
              </DialogDescription>
              <form 
              onSubmit={handleSubmit((data) => {
                handleMembership(app.id, data.endDate);
                closeMembershipDialog(app.id);
              })}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-center col-span-2">
                      Membership From
                    </Label>
                    <Input
                      className="col-span-2"
                      type="date"
                      id="startDate"
                      value={startDate}
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-center col-span-2">
                      Membership Valid upto
                    </Label>
                    <Input
                      className="col-span-2"
                      type="date"
                      id="endDate"
                      {...register("endDate")}
                      min={today}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 col-span-4 text-center">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    Confirm
                  </Button>
                  
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default AdminApplicationManager;