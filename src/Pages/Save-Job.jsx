import { getSaveJob } from '@/Api/api';
import JobCard from '@/components/JobCard';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { BarLoader } from 'react-spinners';

function SaveJob() {
  const { isLoaded, user } = useUser();
  const {
    loading: loadingSavedJobs,
    data: SavedJobs = [],
    fn: fnSavedJob
  } = UseFetch(getSaveJob);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    fnSavedJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className='w-full' width={"100%"} color='#4f46e5' />;
  }

  // Filter out invalid entries and duplicates
  const validSavedJobs = SavedJobs
    .filter((saved) => saved?.job)
    .filter((saved, index, self) => 
      index === self.findIndex((t) => t.job.id === saved.job.id)
    );

  return (
    <div>
      <h1 className='font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Saved Jobs
      </h1>

      {validSavedJobs.length ? (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {validSavedJobs.map((saved) => (
            <JobCard
              key={saved.job.id}
              job={saved.job}
              savedInit={true}
              OnJobSaved={fnSavedJob}
            />
          ))}
        </div>
      ) : (
        <div className='mt-8 text-center text-gray-500'>No Saved Jobs Found</div>
      )}
    </div>
  );
}

export default SaveJob;
