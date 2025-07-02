import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
} from "lucide-react";
import UseFetch from "@/Hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { UpdateApplication } from "@/Api/apiApplication";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ApplicationCard({ application, isCandidate = false }) {
  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = UseFetch(UpdateApplication);

  const handleStatusChange = (status) => {
    fnHiringStatus({
      job_id: application.job_id,
      status,
    });
  };

  return (
    <Card className="flex flex-col gap-4">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2 text-lg font-semibold">
          {isCandidate
            ? `${application?.jobs?.title} at ${application?.jobs?.company?.name}`
            : application?.name}

          {application?.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume"
            >
              <Download
                size={18}
                className="bg-white text-black rounded-full h-8 w-8 p-1.5 hover:bg-gray-100 cursor-pointer"
              />
            </a>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={15} />
            {application?.experience} Years of Experience
          </div>
          <div className="flex items-center gap-2">
            <School size={15} /> {application?.education}
          </div>
          <div className="flex items-center gap-2">
            <Boxes size={15} />
            <span className="flex gap-1 flex-wrap">
              {application?.skills
                ?.split(",")
                .map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 rounded-full px-2 py-0.5 text-xs"
                  >
                    {skill.trim()}
                  </span>
                ))}
            </span>
          </div>
        </div>
        <hr />
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
        <span >
          {new Date(application?.created_at).toLocaleDateString()}{" "}
          {new Date(application?.created_at).toLocaleTimeString()}
        </span>

        {isCandidate ? (
          <span className="capitalize text-gray-700">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
}

export default ApplicationCard;
