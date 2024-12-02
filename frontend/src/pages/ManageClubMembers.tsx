import { BACKEND_URL } from '@/config';
import { ClubMember, ClubMemberships, clubsMembershipDataAtom } from '@/recoil';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import axios from 'axios';
import { CheckCircle, ChevronDown, CreditCard, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const ManageClubMembers = () => {
  const [clubsMembsersData , setClubsMembersData ] = useRecoilState<ClubMemberships>(clubsMembershipDataAtom);
  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);
  const [isFeeDialogOpen , setIsFeeDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'remove' | 'fees' | null>(null);

  useEffect(() =>{
    const fetchClubsData = async () =>{
      try{
        const response = await axios.get<ClubMemberships>(`${BACKEND_URL}/api/v1/clubs/members`,{
          headers:{
            Authorization:"Bearer " + localStorage.getItem("authToken"),
          }
        });
        setClubsMembersData(response.data);
      }catch(error){
        console.log('Error fetching Club Details..',error);
      }
    }
    fetchClubsData();   
  },[])

  const handleMemberAction = async (member: ClubMember, action: 'remove' | 'fees') => {
    setSelectedMember(member);
    setActionType(action);

    if (action === 'fees') {
      setIsFeeDialogOpen(true);
    }
  };

  const confirmAction = async () => {

  };
  

  return (
    <div className="bg-white px-10 text-center p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">Club Member Management</h3>
      <Accordion type="single" collapsible className="space-y-4">
            {clubsMembsersData.map((club) => (
              <AccordionItem 
              key={club.id} 
              value={club.id}
              className="border border-indigo-100 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center space-x-3">
                  <Users size={20} className="text-gray-800" />
                   <span className="font-medium text-gray-800">{club.name}</span>
                  {club.memberships && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <CheckCircle size={12} className="mr-1" />
                      {club.memberships.length} members
                    </span>
                  )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className=" border-b border-indigo-100">
                        <th className="px-4 py-2 text-indigo-600">Name</th>
                        <th className="px-4 py-2 text-indigo-600">Email</th>
                        <th className="px-4 py-2 text-indigo-600">Phone No.</th>
                        <th className="px-4 py-2 text-indigo-600">Fees</th>
                        <th className="px-4 py-2 text-indigo-600">Joined</th>
                        <th className="px-4 py-2 text-indigo-600">Membership Till</th>
                        <th className="px-4 py-2 text-indigo-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {club.memberships?.map((member) => (
                        <tr key={member.id} className="border-b border-indigo-50 hover:bg-indigo-50/30">
                          <td className=" px-1 py-2">{member.user.name}</td>
                          <td className="px-4 py-2">{member.user.email}</td>
                          <td className="px-4 py-2">{member.user.phno}</td>
                          <td className="px-4 py-2">
                          {member.fees.length > 0 ? (
                            <div className="space-y-2">
                              {member.fees.map((fee) => (
                                <div
                                  key={fee.id}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    fee.status === "PAID"
                                      ? "bg-green-100 text-green-800"
                                      : fee.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  <span>{fee.type}</span>: {fee.status} ({fee.amount.toFixed(2)})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">No Fees</span>
                          )}
                          </td>

                          <td className="px-4 py-2 text-sm text-gray-600">
                            {new Date(member.membershipStartDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {new Date(member.membershipValidDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleMemberAction(member, 'remove')}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove Member
                                </DropdownMenuItem>
                  
                                <DropdownMenuItem
                                  onClick={() => 
                                   { 
                                    handleMemberAction(member,'fees');
                                  }}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Add Payment
                                </DropdownMenuItem>
                                {isFeeDialogOpen && selectedMember && (
                                  <AddFeeDialog
                                    clubId={club.id}
                                    memberId={selectedMember.id}
                                    existingFees={selectedMember.fees || []}
                                    onClose={() =>{
                                      setIsFeeDialogOpen(false)}
                                    } 
                                    isOpen={isFeeDialogOpen}
                                  />
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
    </div>
  )
}

const AddFeeDialog = ({
  clubId,
  memberId,
  existingFees,
  isOpen,
  onClose,
}: {
  clubId: string;
  memberId: string;
  existingFees: {
    id: string;
    type: "MONTHLY" | "ANUALLY" | "FINE" | "OTHER";
    description: string;
    amount: number;
    dueDate: Date;
    status: "PAID" | "PENDING" | "OVERDUE";
  }[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [feeType, setFeeType] = useState<string>("MEMBERSHIP");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");

  const handleClose = () => {
    setFeeType("MEMBERSHIP");
    setDescription("");
    setAmount(0);
    setDueDate("");
    onClose();
  };

  const handleAddFee = async () => {
    try {
        await axios.post(`${BACKEND_URL}/api/v1/clubs/${clubId}/fees`, {
          type: feeType,
          description,
          amount,
          dueDate,
          userId: memberId,
        },{
          headers:{
            Authorization: 'Bearer '+ localStorage.getItem("authToken"),
          }
        });
        toast.success("Fee added successfully");
      
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save fee");
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Add Fee"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {"Add a new fee for the member."}
        </DialogDescription>
        <div className="space-y-4">
          <div>
            <label>Type</label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="MEMBERSHIP">Membership</option>
              <option value="FINE">Fine</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddFee}>
            {"Add Fee"}
          </Button>
        </DialogFooter>
        <div className="mt-6">
          <h3 className="text-lg font-medium">Existing Fees</h3>
          <ul className="space-y-2">
            {existingFees.map((fee) => (
              <li
                key={fee.id}
                className="border border-gray-500 p-2 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Type:</strong> {fee.type}
                  </p>
                  <p>
                    <strong>Description:</strong> {fee.description}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{fee.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {new Date(fee.dueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {fee.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageClubMembers

