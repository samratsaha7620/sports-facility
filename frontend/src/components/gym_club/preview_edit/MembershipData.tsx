import React, { useEffect, useState } from 'react';
import { Image,Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../../public/tulogo.png';


export type GymUserInfo = {
  choiceOfDiscipline: string[];
  name: string;
  sexType: number;
  dob: Date;
  rollno: string;
  semester: string;
  dept:string;
};

type DocumentInfo = {
  key: string;
  myFilePath: string;
};

export type GymUserData = [GymUserInfo, ...DocumentInfo[]];

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
  data: GymUserData;
}

const MembershipPDF: React.FC<Props> = ({ data }:{data:GymUserData}) =>{ 
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading..</div>;
  }


  const HeaderSection = () => (
    <View style={styles.headingstyle}>
      <View style={[styles.headingSection, { alignItems: 'center' }]}>
        <Image style={styles.logo} src={logo}/>
      </View>
      <View style={[styles.headingSection, { alignItems: 'center' }]}>
        <Text style={[styles.heading, { textAlign: 'center' }]}>TEZPUR UNIVERSITY, TEZPUR</Text>
        <Text 
        style={{
          fontSize: 10, 
          marginBottom: 5, 
          fontWeight: 800,
          textAlign: 'center',
          paddingLeft: 30,
          paddingRight: 30,}}      
        >Gymnasium Club
        </Text>
        <Text 
        style={{
          fontSize: 10, 
          marginBottom: 5, 
          fontWeight: 800 ,
          paddingRight:10,
          textAlign:"center"
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
            src={data[2].myFilePath}
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
            <Text style={styles.label}>Choice Of Disclipline:</Text>
            <Text style={styles.value}>{Array.isArray(data[0].choiceOfDiscipline) 
              ? data[0].choiceOfDiscipline.join(', ') 
              : ''}</Text>
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
            <Text style={styles.label}>Roll No:</Text>
            <Text style={styles.value}>{data[0].rollno}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{data[0].semester}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{data[0].dept}</Text>
          </View>
        </View>
        
        

        <View style={{marginTop: 40, 
            flexDirection:"row",
            alignItems:"stretch",
            marginBottom: 10,
            }}>

              <View style={{marginRight: 120}}>
                <View style={{borderBottom: '1px solid black',width: '200px',marginBottom: 5,}} />
                <Text style={{marginBottom: 5,fontSize: 10,}}>Signature of the Applicant</Text>
              </View>
              <View>
                <View style={{borderBottom: '1px solid black',width: '200px',marginBottom: 5,}} />
                <Text style={{marginBottom: 5,fontSize: 10,}}>Signature of the Hostel Warden/Head of the Department </Text>
              </View>
        </View>
        <Text style={{marginBottom: 5,fontSize: 10,}}>Dated: __________</Text>
      </Page>
    </Document>
  );
}

export default MembershipPDF;
