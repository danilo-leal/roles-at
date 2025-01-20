import { useEffect, useState, useRef } from "react";
import { createSlug } from "@/utils/slugify";
import { Job } from "@/types/job";
import { useRouter } from "next/router";
import clsx from "clsx";
import Image from "next/image";
import { Navbar } from "@/components/primitives/Navbar";
import { Chip } from "@/components/primitives/Chip";
import { ContainerTransition } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { SectionDivider } from "@/components/primitives/Divider";
import { Input, InputGroup } from "@/components/primitives/Input";
import { Kbd } from "@/components/primitives/Keybinding";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { formatDate } from "@/utils/date";
import { MapPin, Clock, MagnifyingGlass } from "@phosphor-icons/react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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

      return searchMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "i") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const { company } = router.query;
    if (company && typeof company === "string") {
      const job = jobs.find((j) => j.company_slug === company);
      if (job) {
        setSelectedJob(job);
        setIsDialogOpen(true);
      }
    }
  }, [router.query, jobs]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
    router.push(`/?company=${job.company_slug}`, undefined, {
      shallow: true,
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

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
          <button
            key={job.id}
            type="button"
            aria-label={`Apply for ${job.title} at ${job.company}`}
            onClick={() => handleJobClick(job)}
            className={clsx(
              "group cursor-pointer rounded-lg p-4 flex items-center gap-4",
              "border default-border-color dark:hover:!border-orange-300/40",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/20",
              "hover:[box-shadow:5px_5px_0_hsla(26,_90%,_40%,_0.1)]",
              "transition-all duration-100 fv-style",
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
                <h2 className="font-medium">{job.company}</h2>
                <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
                  <Clock size={12} />
                  {formatDate(job.created_at)}
                </p>
              </div>
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-zinc-700 dark:text-zinc-500">
                  {job.title}
                </p>
                {job.location && (
                  <Chip color="zinc" className="gap-1">
                    <MapPin />
                    <span className="">{job.location}</span>
                  </Chip>
                )}
              </div>
            </div>
          </button>
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
      <hgroup className="w-full flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Find Your Next Role</h1>
        <p className="text-xs font-mono dark:text-zinc-500">
          {filteredJobs.length} Open Roles
        </p>
      </hgroup>
      <InputGroup data-slot="search" className="mb-3">
        <MagnifyingGlass data-slot="icon" />
        <Input
          ref={searchInputRef}
          startSlot
          keybinding
          type="search"
          aria-label="Search"
          placeholder="Search for roles, location, or companies…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="hidden absolute inset-y-0 right-4 sm:flex items-center gap-1">
          <Kbd char="⌘" />
          <Kbd char="I" />
        </span>
      </InputGroup>
      {loading ? renderLoading() : renderContent()}
      <JobDetailsDialog
        job={selectedJob}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </ContainerTransition>
  );
}
