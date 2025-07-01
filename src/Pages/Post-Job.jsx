import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { State } from 'country-state-city';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import UseFetch from '@/Hooks/use-fetch';
import { getCompanies } from '@/Api/companiesApi';
import { addNewJob } from '@/Api/api';
import AddCompanyDrawer from '@/AddCompany-Drawer';

// -----------------------
// Schema Validation
// -----------------------
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  company_id: z.string().min(1, 'Company is required'),
  requirements: z.string().optional(),
});


// -----------------------
// Component
// -----------------------
const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      company_id: '',
      requirements: '',
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fetchCompanies,
    data: companies,
    loading: loadingCompanies,
  } = UseFetch(getCompanies);

  const {
    fn: createJob,
    data: createdJob,
    loading: creatingJob,
    error: createJobError,
  } = UseFetch(addNewJob);

  // Fetch companies once user is loaded
  useEffect(() => {
    if (isLoaded) fetchCompanies();
  }, [isLoaded]);

  // Redirect on successful job creation
  useEffect(() => {
    if (createdJob?.length > 0) navigate('/jobs');
  }, [createdJob, navigate]);

  // If user not loaded
  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <BarLoader color="#36d7b7" width={"100%"} />
      </div>
    );
  }

  // Only recruiters can post
  if (user?.unsafeMetadata?.role !== 'recruiter') {
    return <Navigate to="/jobs" />;
  }


  // -----------------------
  // Handle Submit
  // -----------------------
  const onSubmit = (data) => {
    createJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };


  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <h1 className="font-extrabold text-4xl md:text-6xl text-center pb-8 text-gradient">Post a Job</h1>

      <div className="rounded-2xl shadow-xl p-6 md:p-10 border">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {/* Title */}
          <div>
            <label className="block font-semibold mb-2">Job Title</label>
            <Input placeholder="Job Title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">Job Description</label>
            <Textarea placeholder="Detailed description" {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Location */}
            <div>
              <label className="block font-semibold mb-2">Location</label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {State.getStatesOfCountry('IN').map(({ name }) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>

            {/* Company */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">Company</label>
                <AddCompanyDrawer fetchCompanies={fetchCompanies} />
              </div>
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {(companies || []).map(({ id, name }) => (
                        <SelectItem key={id} value={String(id)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.company_id && <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>}
            </div>

          </div>

          {/* Requirements */}
          <div>
            <label className="block font-semibold mb-2">Requirements (Optional)</label>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Error */}
          {createJobError?.message && <p className="text-red-500 text-sm">{createJobError.message}</p>}

          {/* Loader */}
          {creatingJob && (
            <div className="flex justify-center items-center">
              <BarLoader color="#36d7b7" width={"100%"} />
            </div>
          )}

          <Button
            type="submit"
            variant="blue"
            size="lg"
            className="mt-4 w-full md:w-auto"
          >
            Post Job
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
