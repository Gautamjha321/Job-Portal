import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from "zod"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BarLoader } from 'react-spinners'
import UseFetch from '@/Hooks/use-fetch'
import { applyToJob } from '@/Api/apiApplication'

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
})

const ApplyJobDrawer = ({ user, job, fetchJob, applied = false }) => {

  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  })

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
  })
}


  return (
    <div>
      <Drawer>
        {applied || !job?.isOpen ? (
          // Already applied OR job closed → show static button
          <Button variant="outline" className="w-full" disabled>
            {applied ? "Already Applied" : "Job Closed"}
          </Button>
        ) : (
          // Can apply → show DrawerTrigger
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full">
              Apply Now
            </Button>
          </DrawerTrigger>
        )}

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Apply for {job?.title} at {job?.company?.name}</DrawerTitle>
            <DrawerDescription>Please Fill the Form Below</DrawerDescription>
          </DrawerHeader>

          <form
            className="flex flex-col gap-4 p-4 pb-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="number"
              placeholder="Years of Experience"
              className="flex-1"
              {...register("Experience", { valueAsNumber: true })}
            />
            {errors.Experience && (
              <p className="text-red-500 text-sm">{errors.Experience.message}</p>
            )}

            <Input
              type="text"
              placeholder="Skills (comma separated)"
              className="flex-1"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills.message}</p>
            )}

            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Experienced" id="experienced" />
                    <Label htmlFor="experienced">Experienced</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500 text-sm">{errors.education.message}</p>
            )}

            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500 text-sm">{errors.resume.message}</p>
            )}

            {errorApply?.message && (
              <p className="text-red-500 text-sm">{errorApply?.message}</p>
            )}

            {loadingApply && (
              <BarLoader className="mb-4" width="100%" color="#36d7b7" />
            )}

            <Button type="submit" variant="blue" size="lg">
              Submit Application
            </Button>
          </form>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ApplyJobDrawer
