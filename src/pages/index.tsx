import { useEffect, useState } from "react";
import { createSlug } from "@/utils/slugify";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/primitives/Navbar";
import { Chip } from "@/components/primitives/Chip";
import { ContainerTransition } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { SectionDivider } from "@/components/primitives/Divider";
import { Input, InputGroup } from "@/components/primitives/Input";
import { Select } from "@/components/primitives/Select";
import { formatDate } from "@/utils/data";
import { MapPin, Clock, MagnifyingGlass } from "@phosphor-icons/react";

type Job = {
  id: string;
  company: string;
  avatar_img: string;
  location: string;
  title: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  is_approved: boolean;
  application_link: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        // Only show approved jobs
        const approvedJobs = data.filter((job: Job) => job.is_approved);
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      const jobDate = new Date(job.created_at);
      const daysDiff = (now.getTime() - jobDate.getTime()) / (1000 * 3600 * 24);

      let timeMatch = true;
      if (timeFilter === "week") {
        timeMatch = daysDiff <= 7;
      } else if (timeFilter === "month") {
        timeMatch = daysDiff <= 30;
      } else if (timeFilter === "threeMonths") {
        timeMatch = daysDiff <= 90;
      }

      return searchMatch && timeMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, timeFilter]);

  const renderLoading = () => (
    <div className="py-2 flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-[78px] w-full" />
      ))}
    </div>
  );

  const renderContent = () => (
    <div className="py-2 flex flex-col gap-3">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Link
            href={`/${createSlug(job.company)}`}
            key={job.id}
            className={clsx(
              "rounded-sm p-4 flex items-center gap-4",
              "border default-border-color dark:hover:!border-zinc-700",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/20",
              "hover:[box-shadow:5px_5px_0_hsla(219,_90%,_60%,_0.1)]",
              "transition-colors tran duration-100",
            )}
          >
            {job.avatar_img && (
              <Image
                src={job.avatar_img}
                alt={`${job.company} logo`}
                width={44}
                height={44}
                className="rounded-full size-10 grow-0 shrink-0 object-cover"
              />
            )}
            <div className="w-full flex flex-col">
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex items-center gap-2">
                  <h2 className="font-medium">{job.company}</h2>
                  <Chip color={job.is_open ? "green" : "red"} size="small">
                    {job.is_open ? "Open" : "Closed"}
                  </Chip>
                </div>
                <p className="shrink-0 flex items-center gap-1 text-sm dark:text-zinc-500">
                  <Clock />
                  {formatDate(job.created_at)}
                </p>
              </div>
              <div className="w-full flex justify-between">
                <p className="text-sm text-zinc-700 dark:text-zinc-500">
                  {job.title}
                </p>
                {job.location && (
                  <p className="flex items-center gap-1 text-sm dark:text-zinc-500">
                    <MapPin />
                    <span className="">{job.location}</span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No matching jobs found</p>
      )}
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider />
      <h1 className="text-xl font-bold mb-4">Your next role at:</h1>
      <div className="mb-2 flex flex-col sm:flex-row gap-3">
        <InputGroup>
          <MagnifyingGlass data-slot="icon" />
          <Input
            type="search"
            aria-label="Search"
            placeholder="Search for roles, location, or companies…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Select
          name="status"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="all">All time</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="threeMonths">Last three months</option>
        </Select>
      </div>
      {loading ? renderLoading() : renderContent()}
    </ContainerTransition>
  );
}
