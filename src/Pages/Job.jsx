import { getSingleJob, updateHiringStatus } from '@/Api/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import ApplyJobDrawer from '@/components/ApplyToJob';
import ApplicationCard from '@/components/Application-Card';

function JobPage() {

  const {isLoaded , user} = useUser();
  const {id} = useParams();

  const {fn:fnJob , data:Job , loading:loadingJob} = UseFetch(getSingleJob ,{
  job_id : id,

} );

 const {fn:fnHiringStatus ,  loading:loadingHiringStatus} = UseFetch(updateHiringStatus ,{
  job_id : id,

} );

const handleStatusChange = (value)=>{
  const isOpen  = value ==='open';
  fnHiringStatus(isOpen).then(()=>fnJob());
}

useEffect(()=>{
  if(isLoaded) fnJob();
},[isLoaded])

if (!isLoaded|| loadingJob ) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <div className='flex flex-col gap-8 mt-5 ' >
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center' >
        <h1 className='font-extrabold pb-3 text-4xl sm:text-6xl' >{Job?.title}</h1>
        <img src={Job?.company?.logo_url} alt={Job?.title} className='h-12'  />
      </div>
    
    <div className='flex justify-between' >
      <div className='flex gap-2' >
        <MapPinIcon />
        {Job?.location}
          
      </div>
      <div className='flex gap-2 ' >
        <Briefcase/>
        {Job?.applications?.length} Applicant 

      </div>

  <div className='flex gap-2 ' >
        <Briefcase/>
        {Job?.isOpen?<><DoorOpen/>Open</>:<><DoorClosed/>Close</>}

      </div>

    </div>
{/* 
    Hireing the job */}

{
  Job?.recruiter_id === user?.id && (
     <Select onValueChange ={handleStatusChange} >
  <SelectTrigger className={`w-full ${Job?.isOpen ? "bg-green-950" :"bg-red-700"}`} >
    <SelectValue placeholder={
      "Hiring status" + (Job?.isOpen ? '(Open)' :'(Closed)')
    } />
  </SelectTrigger>
  <SelectContent  >
    
     <SelectItem  value='open'>Open</SelectItem>
    <SelectItem  value='closed'>closed</SelectItem>
    
    
   
  </SelectContent>
</Select>
  )
}


    <h2 className='text-2xl sm:text-3xl font-bold' > About the Jobs </h2>
    <p className='sm:text-lg' >{Job?.description}</p>

    <h2 className='text-2xl sm:text-3xl font-bold' > What We are looking for  </h2>
    <MDEditor.Markdown
  source={Job?.requirements}
  className="bg-transparent text-inherit sm:text-lg"
  style={{
    backgroundColor: 'transparent',
    color: 'inherit',
  }}
/>

{Job?.recruiter_id !== user?.id && (<ApplyJobDrawer job={Job} user={user} fetchJob={fnJob} applied={Job?.applications?.find((ap)=>ap.candidate_id === user.id)} />)}

  {Job?.applications?.length >0 && Job?.recruiter_id === user?.id &&(
    <div>
      <h2 className='text-2xl sm:text-3xl font-bold'  >Application</h2>
      {Job?.applications.map((application)=>{
        return <ApplicationCard key={application.id} application={application} />
      })}
    </div>
  ) }

    </div>


  )
}

export default JobPage