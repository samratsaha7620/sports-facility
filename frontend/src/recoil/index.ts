import { GymUserData } from "@/components/gym_club/preview_edit/MembershipData";
import { UserData } from "@/components/swimming_club/preview-edit/MembershipData";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import {atom, atomFamily, selectorFamily} from "recoil"


const getLocalStorageValue = (key:string ,defaultValue:any) =>{
  const savedValue= localStorage.getItem(key);
  return savedValue !== null ? JSON.parse(savedValue): defaultValue
}

const setLocalStorageValue = (key:string ,value: any)=>{
  localStorage.setItem(key, JSON.stringify(value));
}

export const userAuthState = atom({
  key:"userAuthSate",
  default: getLocalStorageValue('userAuthState',{
    isAuthenticated:false , 
    userId:"",
    userType:null as 'ADMIN' | "USER" | null,
  }),
  effects:[
    ({onSet})=>{
      onSet((newValue) =>{
        setLocalStorageValue('userAuthState',newValue);
      })
    }
  ],
})


export interface ClubsApplicationDetails {
  id:string;
  name:string;
  isPublished:boolean;
  publishEndDate: Date;
  applicationCount: number;
}


export const clubApplicationDataAtom = atom<ClubsApplicationDetails[]>({
  key:"clubApplicationDataAtom",
  default:[],
})


export interface AvailableClubs{
  id: string,
  name : string,
  description : string,
  isApplicationPublished : boolean,
  publishStartDate : Date,
  publishEndDate : Date
} 


export const availableClubsDataAtom =  atom<AvailableClubs[]>({
  key:"availableClubsDataAtom",
  default:[],
})


export interface PendingApplicationsData {
  id: string;
  studentId: string;
  clubId: string;
  data: any[];
  stage: string;
  createdAt: Date
  updatedAt: Date
  clubName: string
}

export const pendingApplicationsDataAtom = atom<PendingApplicationsData[]>({
  key:"pendingApplicationsDataAtom",
  default:[],
})

export interface SubmittedApplicationsData {
  id: string;
  studentId: string;
  clubId: string;
  data: UserData | GymUserData;
  stage: string;
  createdAt: Date
  updatedAt: Date
  clubName: string
}

export const submittedApplicationsDataAtom = atom<SubmittedApplicationsData[]>({
  key:"submittedApplicationsDataAtom",
  default:[],
})

interface Student {
  name: string;
  email: string;
  phno: string;
}

interface Application {
  id: string;
  studentId: string;
  student: Student; 
  data: any[]; 
  stage: "PENDING" | "ACCEPTED" | "REJECTED" | "SUBMITTED";
  isMembershipGranted:boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type Applications = Application[];

interface ClubApplicationsState {
  club: {
    id: string;
    name: string;
    isApplicationPublished: boolean,
    publishStartDate: Date,
    publishEndDate:Date
  };
  applications: Applications;
}
export const clubApplicationsState = atomFamily({
  key: 'clubApplicationsState',
  default: selectorFamily<ClubApplicationsState, string>({
    key: "clubApplicationsSelectorFamily",
    get: (clubId :string) => async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/clubs/${String(clubId)}/applications`,{
        headers:{
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        }
      });
      return res.data;
    },
  })
})
export type ClubMember = {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      phno: string;
    };
    membershipStartDate: Date; 
    membershipValidDate: Date; 
    // status: "ACTIVE" | "DEACTIVE"; // Enum for membership status
    fees: {
      id: string;
      type: "MONTHLY"| "ANUALLY" | "FINE" | "OTHER";
      description: string;
      amount: number;
      dueDate: Date; // ISO date string
      status: "PAID" | "PENDING" | "OVERDUE";
    }[]
};
export type ClubMemberships = {
  id: string;
  name: string;
  memberships: ClubMember[];
}[];

export const clubsMembershipDataAtom = atom<ClubMemberships>({
  key:"clubsMembershipDataAtom",
  default:[],
})