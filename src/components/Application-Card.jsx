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
} from "@/components/ui/select"; // ✅ Make sure this is your pre-built Select

function ApplicationCard({ application, isCandidate = false }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

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
    <Card className="flex flex-col gap-5 flex-1">
      {loadingHiringStatus && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2 text-lg font-semibold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BriefcaseBusiness size={15} />{" "}
            {application?.experience} Years of Experience
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <School size={15} /> {application?.education}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Boxes size={15} /> skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>
          {new Date(application?.created_at).toLocaleString()}
        </span>
        {isCandidate ? (
          <span>status: {application.status}</span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
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
