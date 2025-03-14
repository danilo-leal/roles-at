import * as React from "react";
import { Job } from "@/types/job";
import { RoleEntry } from "@/components/RoleEntry";
import { PageContainer } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { SectionDivider } from "@/components/primitives/Divider";
import { Input, InputGroup } from "@/components/primitives/Input";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Kbd } from "@/components/primitives/Keybinding";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EmptyBox } from "@/components/primitives/Illustrations";

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }
        const { data } = await response.json();
        const approvedJobs = data.filter((job: Job) => job.is_approved);
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(
          `Failed to fetch jobs: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  React.useEffect(() => {
    const filtered = jobs.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  React.useEffect(() => {
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

  const renderLoading = () => (
    <motion.div
      key="loading"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.2 },
        layout: { duration: 0.2 },
      }}
      className="py-2 flex flex-col gap-2"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-[97px] sm:h-[69px] w-full" />
      ))}
    </motion.div>
  );

  const renderContent = () => (
    <div className="py-2 size-full flex flex-col">
      {filteredJobs.length > 0 ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-1 border-b last:border-0 default-border-color"
            >
              <RoleEntry job={job} />
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-none py-16 size-full flex flex-col items-center gap-4"
        >
          <EmptyBox className="size-48 opacity-60" />
          <span className="text-xs default-p-color font-mono">
            No matching jobs found
          </span>
        </motion.div>
      )}
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  const renderPlural = () => {
    return filteredJobs.length === 1
      ? "Open Role"
      : filteredJobs.length > 1
        ? "Open Roles"
        : null;
  };

  const renderOpenRolesLabel = () => {
    if (filteredJobs.length >= 1) {
      return (
        <AnimatePresence mode="wait">
          <motion.p
            key="open-roles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="hidden sm:inline text-xs font-mono muted-p"
          >
            {filteredJobs.length} {renderPlural()}
          </motion.p>
          <motion.p
            key="open-roles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="inline sm:hidden text-xs font-mono muted-p"
          >
            {filteredJobs.length} Open
          </motion.p>
        </AnimatePresence>
      );
    } else {
      return;
    }
  };

  return (
    <PageContainer title="Roles">
      <SectionDivider />
      <hgroup className="w-full flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Find Your Next Role</h1>
        <div className="flex items-center gap-2">
          {renderOpenRolesLabel()}
          <SubscribeForm />
        </div>
      </hgroup>
      <InputGroup data-slot="search">
        <Search data-slot="icon" />
        <Input
          ref={searchInputRef}
          startSlot
          keybinding
          type="search"
          aria-label="Search"
          placeholder="Roles, location, or companies…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="hidden absolute inset-y-0 right-4 sm:flex items-center gap-1">
          <Kbd char="⌘" />
          <Kbd char="I" />
        </span>
      </InputGroup>
      <AnimatePresence mode="wait">
        {loading ? renderLoading() : renderContent()}
      </AnimatePresence>
    </PageContainer>
  );
}
