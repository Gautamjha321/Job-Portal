import CreatedApplications from '@/components/Created-Application';
import CreatedJobs from '@/components/Created-Jobs';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { BarLoader } from 'react-spinners';

function MyJob() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <BarLoader width="100%" color="#36d7b7" />
      </div>
    );
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";
  const heading = isCandidate ? "My Applications" : "My Jobs";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold mb-10">
        {heading}
      </h1>

      {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
    </div>
  );
}

export default MyJob;
