import CreatedApplications from '@/components/Created-Application';
import CreatedJobs from '@/components/Created-Jobs';
import { useUser } from '@clerk/clerk-react'
import React, { use } from 'react'
import { BarLoader } from 'react-spinners';

function MyJob() {

  const {isLoaded,user} = useUser();

if(!isLoaded ){
  return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
}

  return (
    <div>
 
 <h1 className='font-extrabold  text-5xl sm:text-7xl text-center pb-8 '> 
  
  {user?.unsafeMetadata?.role === "candidate" ? "My Applications" : "My Jobs" }

    </h1>

    {user?.unsafeMetadata?.role === "candidate" ? ( <CreatedApplications />
    
    ) : ( <CreatedJobs/>
    )}

    </div>
  )
}

export default MyJob