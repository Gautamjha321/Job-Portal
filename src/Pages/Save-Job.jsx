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
    if (isLoaded && user?.id) {
      fnSavedJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  if (!isLoaded || loadingSavedJobs) {
    return (
      <div className="flex justify-center items-center mt-10">
        <BarLoader width="100%" color="#4f46e5" />
      </div>
    );
  }

  // Filter duplicates and null jobs
  const validSavedJobs = SavedJobs
    .filter((saved) => saved?.job)
    .filter((saved, index, self) =>
      index === self.findIndex((t) => t.job.id === saved.job.id)
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-center text-5xl sm:text-6xl font-extrabold pb-6">
        Saved Jobs
      </h1>

      {validSavedJobs.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-12 text-center text-lg text-gray-500">
          😔 You haven’t saved any jobs yet.
        </div>
      )}
    </div>
  );
}

export default SaveJob;
