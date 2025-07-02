import { getjobs } from '@/Api/api';
import { getCompanies } from '@/Api/companiesApi';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import UseFetch from '@/Hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { State } from 'country-state-city';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';

function Joblisting() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company_id, setCompany_id] = useState('');
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs
  } = UseFetch(getjobs, {
    location,
    company_id,
    searchQuery
  });

  const { fn: fnCompanies, data: companies } = UseFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search-query');
    if (query) setSearchQuery(query);
  };

  const clearFilter = () => {
    setSearchQuery('');
    setCompany_id('');
    setLocation('');
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-center gradient-title">
        Latest Jobs
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Input
          type="text"
          placeholder="Search job by title"
          name="search-query"
          className="w-full sm:flex-1 h-12 px-4 text-base"
        />
        <Button type="submit" variant="blue" className="w-full sm:w-auto h-12 px-6">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
        {/* Location Filter */}
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            {State.getStatesOfCountry('IN').map(({ name }) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Company Filter */}
        <Select value={company_id} onValueChange={setCompany_id}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            {(companies || []).map(({ name, id }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          onClick={clearFilter}
          variant="destructive"
          className="w-full sm:w-40 h-12"
        >
          Clear Filters
        </Button>
      </div>

      {/* Job Results */}
      {loadingJobs ? (
        <BarLoader className="mt-4" width="100%" color="#36d7b7" />
      ) : (
        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Jobs?.length > 0 ? (
            Jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-lg text-gray-500 font-medium py-12">
              😔 No jobs found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Joblisting;
