import React, { useEffect, useState } from 'react';
import { Image,Document, Page, Text, View, StyleSheet ,Svg ,Rect } from '@react-pdf/renderer';
import logo from '../../../../public/tulogo.png';
import photo from '../../../../public/photo.jpg';

export type UserInfo = {
  membershipCategory: string;
  membershipType: string;
  name: string;
  sexType: number;
  dob: Date;
  rollno?: string;
  emp_code?:string;
  semester?: string;
  designation?: string;
  dept:string;
  localGuardian?: string;
  local_contact?:string;
  relativeName?: string;
  relationWithEmployee?:string;
  residingSince?:Date,
  membershipFrom?: Date,
  membershipTo?: Date,
};

type DocumentInfo = {
  key: string;
  myFilePath: string;
};

export type UserData = [UserInfo, ...DocumentInfo[]];
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  headingstyle:{
    flexDirection: 'row',
    padding: 20,
  },
  headingSection:{
    margin: 5,
    textAlign: "center",
    padding: 10,
    flexGrow: 1},
  logo: { width: 50 },
  checkbox:{
    width:15,
    height:15,
    marginRight:5,
  },
  

  section: { marginBottom: 15 },
  heading: { 
    fontSize: 10, 
    marginBottom: 5, 
    fontWeight: 800 
  },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: '40%', fontWeight: 'bold' },
  value: { width: '60%' },
});

interface Props {
  data: UserData;
}

const declarations= {
  self: ['In case of an accident I will not hold the University authorities responsible in any way.Rules & Regulations and their amendments as decided by the swimming pool management committee are applicable on me and I agree to abide by them. I shall cooperate with the authorities in maintaining the discipline in the swimming pool.', 
  'I declare that I am not suffering from any communicable disease, Epilepsy, Cardiac and Psychiatric Illness, etc.',
  'I understand that if any one of the details given above is proved to be false, my membership shall be cancelled and suitable disciplinary action shall be taken against me.'],
  relative: [],
};
const MembershipPDF: React.FC<Props> = ({ data }) =>{ 
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading..</div>;
  }

  const CheckedCheckbox = () => (
    <Svg style={styles.checkbox} viewBox="0 0 20 20">
      <Rect
          x="0"
          y="0"
          width="20"
          height="20"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
    </Svg>
  );


  const HeaderSection = () => (
    <View style={styles.headingstyle}>
      <View style={styles.headingSection}>
        <Image style={styles.logo} src={logo}/>
      </View>
      <View style={styles.headingSection}>
        <Text style={styles.heading}>TEZPUR UNIVERSITY, TEZPUR</Text>
        <Text 
        style={{
          fontSize: 10, 
          marginBottom: 5, 
          fontWeight: 800,
          textAlign: 'center',
          paddingLeft: 30,
          paddingRight: 30,}}      
        >SWIMMING POOL
        </Text>
        <Text 
        style={{
          fontSize: 10, 
          marginBottom: 5, 
          fontWeight: 800 ,
          paddingRight:"100px"
        }}>MEMBERSHIP APPLICATION FORM
        </Text>
      </View>
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Image
            style={{
                width: 80, 
                height: 80, 
                marginBottom: 10 
            }}
            src={photo}
        />
      </View>
    </View>
  );

  return(
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection/>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Membership Category:</Text>
            <Text style={styles.value}>{data[0].membershipCategory}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Membership Type:</Text>
            <Text style={styles.value}>{data[0].membershipType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data[0].name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sex:</Text>
            <Text style={styles.value}>{data[0].sexType ===1 ?  "Male":"Female"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{new Date(data[0].dob).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{data[0].rollno ? "Roll No:":"Employee Code:"}</Text>
            <Text style={styles.value}>{data[0].rollno ? data[0].rollno:data[0].emp_code}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{data[0].semester ? "Semester:":"Designation:"}</Text>
            <Text style={styles.value}>{data[0].semester ? data[0].semester:data[0].designation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{data[0].dept}</Text>
          </View>
        </View>
        
        {data[0].localGuardian && (
          <View style={styles.section}>
            <Text style={styles.heading}>Local Guardian Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name And Address:</Text>
              <Text style={styles.value}>{data[0].localGuardian}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>{data[0].local_contact}</Text>
            </View>
          </View>
        )}
        

        {data[0].relativeName && (
          <View style={styles.section}>
            <Text style={styles.heading}>Additional Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>
              {(() => {
                if (data[0].membershipCategory === "TU Employee Child") {
                    return "Name of Child:";
                } else if (data[0].membershipCategory === "TU Employee Dependent") {
                    return "Name of Dependent:";
                } else {
                    return "Name of Other Relative:";
                }
            })()}
              </Text>
              <Text style={styles.value}>{data[0].relativeName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Relation with Employee:</Text>
              <Text style={styles.value}>{data[0].relationWithEmployee}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Residing Since:</Text>
              <Text style={styles.value}>{data[0].residingSince ? new Date(data[0].residingSince).toLocaleDateString() : "Not available"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Membership Period:</Text>
              <Text style={styles.value}>
                {`From ${data[0].membershipFrom ? new Date(data[0].membershipFrom).toLocaleDateString() : "Not available"} to ${data[0].membershipTo ? new Date(data[0].membershipTo).toLocaleDateString() : "Not available"}`}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.heading}>DECLARATIONS (Self)</Text>
          {declarations.self.map((declaration, index) => 
          <View style={{
            flexDirection:"row",
            alignItems:"center",
            marginBottom: 10,
          }} key={index}>
             <CheckedCheckbox/>
             <Text key={index}>{declaration}</Text>
          </View>
          )}
        </View>

        <View style={{marginTop: 40, 
            flexDirection:"row",
            alignItems:"stretch",
            marginBottom: 10,
            }}>

              <View style={{marginRight: 120}}>
                <View style={{borderBottom: '1px solid black',width: '200px',marginBottom: 5,}} />
                <Text style={{marginBottom: 5,fontSize: 10,}}>{data[0].membershipCategory==="TU Student"?"Signature of the Student" :"Signature of the Employee"}</Text>
              </View>
              <View>
                <View style={{borderBottom: '1px solid black',width: '200px',marginBottom: 5,}} />
                <Text style={{marginBottom: 5,fontSize: 10,}}>{data[0].membershipCategory==="TU Student"?"Signature of the local guardian" :"Signature of the Dependent / Other relative/ Guest"}</Text>
              </View>
        </View>
        <Text style={{marginBottom: 5,fontSize: 10,}}>Dated: __________</Text>
      </Page>
    </Document>
  );
}

export default MembershipPDF;
