import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MapPinIcon, Trash2Icon, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import UseFetch from '@/Hooks/use-fetch'
import { DeleteJob, savejob } from '@/Api/api'
import { BarLoader } from 'react-spinners'

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  OnJobSaved = () => {}
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { fn: fnSavedJob, data: SavedJob, loading: loadingSavedJob } = UseFetch(savejob, {
    alreadySaved: saved,
  });
  const { user } = useUser();

  const handleSaveJob = async () => {
    if (!user?.id || !job?.id) return;
    const result = await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });

    if (result !== null) {
      setSaved(!saved);
    }

    OnJobSaved();
  };

  const {loading: loadingDeleteJob, fn: fnDeleteJob} = UseFetch(DeleteJob,{
    job_id: job.id,
  })

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    OnJobSaved();
  }

  useEffect(() => {
    if (SavedJob !== undefined) setSaved(SavedJob?.length > 0);
  }, [SavedJob]);

  if (!job) {
    return (
      <Card className='flex flex-col p-4'>
        <CardContent>Invalid Job Data</CardContent>
      </Card>
    )
  }

  return (
    <Card className='flex flex-col'>
{loadingDeleteJob && (
 <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
)   
}

      <CardHeader>
        <CardTitle className='flex justify-between font-bold'>
          {job.title || "Untitled Job"}
          {isMyJob && <Trash2Icon fill='red' size={18} className='text-red-300 cursor-pointer' onClick={handleDeleteJob} />}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 flex-1'>
        <div className='flex justify-between'>
          {job.company && job.company.logo_url && (
            <img src={job.company.logo_url} className='h-6' alt='Company Logo' />
          )}
          <div className='flex gap-2 items-center'>
            <MapPinIcon size={15} /> {job.location || "No Location"}
          </div>
        </div>
        <hr />
        {job.description ? (
          job.description.substring(0, job.description.indexOf('.') + 1 || 50)
        ) : (
          <span>No Description Available</span>
        )}
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Link to={`/job/${job.id}`} className='flex-1'>
          <Button variant='secondary' className='w-full'>More Details</Button>
        </Link>
        {!isMyJob && (
          <Button variant='outline' className='w-15' onClick={handleSaveJob} disabled={loadingSavedJob}>
            {saved ? <Heart size={20} stroke='red' fill='red' /> : <Heart size={20} />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
