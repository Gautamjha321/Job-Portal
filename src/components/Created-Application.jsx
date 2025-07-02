import { getApplications } from '@/Api/apiApplication';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './Application-Card';

function CreatedApplications() {

  const {user}=useUser();

  const {loading:loadingApplications,data:applications,fn:fnApplications,}=UseFetch(getApplications ,{
    user_id: user.id, 
  });

  useEffect(() => {
    fnApplications();
  },[]);

  if(loadingApplications){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  } 

  return (
    <div className='flex flex-col gap-2' >
      {applications?.map((application) => {
        return(
          <ApplicationCard key={application.id} application={application} isCandidate />
      );})}
      
    </div>
  )
}

export default CreatedApplications;