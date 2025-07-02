import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarLoader } from 'react-spinners';
import UseFetch from '@/Hooks/use-fetch';
import { applyToJob } from '@/Api/apiApplication';

const schema = z.object({
  Experience: z.number().min(0, "Years of experience must be a positive number"),
  skills: z.string().min(1, "Skills are required"),
  education: z.enum(["Beginner", "Intermediate", "Experienced"]),
  resume: z
    .any()
    .refine((file) => file && file[0], { message: "Resume file is required" })
    .refine(
      (file) =>
        file &&
        file[0] &&
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file[0].type),
      { message: "Resume must be a PDF or Word document" }
    )
});

const ApplyJobDrawer = ({ user, job, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = UseFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      experience: data.Experience,
      skills: data.skills,
      education: data.education,
      resume: data.resume[0],
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer>
      {applied || !job?.isOpen ? (
        <Button variant="outline" className="w-full" disabled>
          {applied ? "Already Applied" : "Job Closed"}
        </Button>
      ) : (
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            Apply Now
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for <strong>{job?.title}</strong> at <strong>{job?.company?.name}</strong>
          </DrawerTitle>
          <DrawerDescription className="text-sm text-gray-500">
            Complete the form to submit your application.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-2 space-y-4">
          {/* Experience */}
          <div>
            <Label>Years of Experience</Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              {...register("Experience", { valueAsNumber: true })}
            />
            {errors.Experience && (
              <p className="text-red-500 text-sm mt-1">{errors.Experience.message}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <Input
              type="text"
              placeholder="e.g., React, Node.js"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
            )}
          </div>

          {/* Education Level */}
          <div>
            <Label className="mb-1 block">Education Level</Label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  {["Beginner", "Intermediate", "Experienced"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level}>{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
            )}
          </div>

          {/* Resume Upload */}
          <div>
            <Label>Resume</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              className="file:text-gray-500"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
            )}
          </div>

          {/* Submission Feedback */}
          {errorApply?.message && (
            <p className="text-red-500 text-sm mt-1">{errorApply.message}</p>
          )}

          {loadingApply && (
            <div className="py-2">
              <BarLoader width="100%" color="#36d7b7" />
            </div>
          )}

          {/* Submit */}
          <Button type="submit" variant="blue" size="lg" className="w-full">
            Submit Application
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
