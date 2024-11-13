import {atom} from "recoil"


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
  isPublished:boolean
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
  stage: string; // Using the enum values for stage
  createdAt: Date
  updatedAt: Date
  clubName: string
}

export const pendingApplicationsDataAtom = atom<PendingApplicationsData[]>({
  key:"pendingApplicationsDataAtom",
  default:[],
})