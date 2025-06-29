import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MapPinIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Heart } from 'lucide-react'
import UseFetch from '@/Hooks/use-fetch'
import { savejob } from '@/Api/api'

const  JobCard=({
  job,
  isMyJob = false,
  savedInit = false,
  OnJobSaved = ()=> {}
})=> {

const [saved , setSaved] = useState(savedInit);

  const {fn:fnSavedJob, data:SavedJob , loading:loadingSavedJob,} = UseFetch(savejob,{
    alreadySaved:saved,
  });

  

const {user} = useUser()

const handleSaveJob = async () => {
  const result = await fnSavedJob({
    user_id: user.id,
    job_id: job.id,
  });

  if (result !== null) {
    setSaved(!saved); // flip the saved status immediately
  }

  OnJobSaved();
};


useEffect(() => {
  if (SavedJob !== undefined) setSaved(SavedJob?.length > 0);
}, [SavedJob]);

  return <Card className='flex flex-col' >
       <CardHeader>
        <CardTitle className='flex justify-between font-bold' >{job.title}
        {isMyJob && <Trash2Icon fill='red' size={18} className='text-red-300 cursor-pointer' />}
        </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 flex-1' >
          <div className='flex justify-between' >
            {job.company && <img src={job.company.logo_url} className='h-6' /> }
            <div className='flex gap-2 items-center'>
              <MapPinIcon size={15} /> {job.location}
            </div>

          </div>
          <hr />
          {job.description.substring(0, job.description.indexOf('.'))}
        </CardContent>
        <CardFooter className='flex gap-2'>
          <Link to={`/job/${job.id}`} className='flex-1' >
          <Button variant='secondary' className='w-full' > more details </Button>
          </Link>

          {
            !isMyJob && (
              <Button variant='outline' className='w-15' onClick={handleSaveJob} disabled={loadingSavedJob} >
               { saved ?(
                   <Heart  size={20} stroke = 'red' fill='red' />
               ):(
                 <Heart  size={20}  />
               )

               }
             
              </Button>
            )
          }

          
        </CardFooter>
       
  </Card>
}

export default JobCard