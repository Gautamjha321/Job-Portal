import { getMyJobs } from '@/Api/api';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import JobCard from './JobCard';

function CreatedJobs() {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs
  } = UseFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingCreatedJobs) {
    return (
      <div className="flex justify-center py-8">
        <BarLoader width="100%" color="#36d7b7" />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      

      {createdJobs?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {createdJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              OnJobSaved={fnCreatedJobs}
              isMyJob
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg sm:text-xl">
            You haven’t posted any jobs yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default CreatedJobs;
