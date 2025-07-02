import { getSingleJob, updateHiringStatus } from '@/Api/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import MDEditor from '@uiw/react-md-editor';
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinIcon
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import ApplyJobDrawer from '@/components/ApplyToJob';
import ApplicationCard from '@/components/Application-Card';

function JobPage() {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const { fn: fnJob, data: Job, loading: loadingJob } = UseFetch(getSingleJob, {
    job_id: id
  });

  const { fn: fnHiringStatus, loading: loadingHiringStatus } = UseFetch(updateHiringStatus, {
    job_id: id
  });

  const handleStatusChange = (value) => {
    const isOpen = value === 'open';
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-extrabold text-4xl sm:text-5xl">{Job?.title}</h1>
        </div>
        <img
          src={Job?.company?.logo_url}
          alt={Job?.title}
          className="h-14 object-contain"
        />
      </div>

      {/* Job Metadata */}
      <div className="flex flex-wrap gap-6 sm:gap-10  text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          {Job?.location}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {Job?.applications?.length} Applicant
        </div>
        <div className="flex items-center gap-2">
          {Job?.isOpen ? <DoorOpen className="h-5 w-5 text-green-600" /> : <DoorClosed className="h-5 w-5 text-red-600" />}
          <span className={Job?.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {Job?.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Recruiter Controls */}
      {Job?.recruiter_id === user?.id && (
        <div className="w-full sm:w-64">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full border-2 ${Job?.isOpen ? 'border-green-600' : 'border-red-600'} rounded-md`}
            >
              <SelectValue
                placeholder={`Hiring Status: ${Job?.isOpen ? 'Open' : 'Closed'}`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Job Description */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">About the Job</h2>
        <p className="sm:text-lg  leading-relaxed">{Job?.description}</p>
      </section>

      {/* Job Requirements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">What We Are Looking For</h2>
        <MDEditor.Markdown
          source={Job?.requirements}
          className="bg-transparent text-inherit text-gray-700 text-base sm:text-lg"
          style={{
            backgroundColor: 'transparent',
            color: 'inherit'
          }}
        />
      </section>

      {/* Apply Drawer for Candidate */}
      {Job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={Job}
          user={user}
          fetchJob={fnJob}
          applied={Job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {/* Application List for Recruiter */}
      {Job?.applications?.length > 0 && Job?.recruiter_id === user?.id && (
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold border-b pb-2">Applications</h2>
          {Job?.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </section>
      )}
    </div>
  );
}

export default JobPage;
