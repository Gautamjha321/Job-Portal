import { getjobs } from '@/Api/api'
import { getCompanies } from '@/Api/companiesApi';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UseFetch from '@/Hooks/use-fetch'
import { useSession, useUser } from '@clerk/clerk-react'
import { State } from 'country-state-city';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';

function Joblisting() {

const [searchQuery , setSearchQuery] = useState('');
  const [location , setLocation ] = useState('');
  const [company_id , setCompany_id] = useState('');
  const {isLoaded} = useUser() 
  
const {fn:fnJobs , data:Jobs , loading:loadingJobs} = UseFetch(getjobs ,{
  location,
  company_id,
  searchQuery,
} );

const {fn:fnCompanies ,data:companies} = UseFetch(getCompanies);



useEffect(()=>{
  if(isLoaded) fnCompanies();
},[isLoaded ]);

useEffect(()=>{
  if(isLoaded) fnJobs();
},[isLoaded , location ,company_id,searchQuery ]);

const handleSearch=(e)=>{
  e.preventDefault();
  let formData = new FormData(e.target);
  const query = formData.get('search-query');
  if (query) setSearchQuery(query);


}

const clearFilter =()=>{
  setSearchQuery('');
  setCompany_id('');
  setLocation('');
}

 if (!isLoaded) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }
  return <div>
    <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Job</h1>

    {/* Add filter  */}

    <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'  >
      <Input type='text' placeholder = 'Search Job By titiles' name = 'search-query' className='h-full flex-1 px-4 text-md' />
      <Button type='submit ' className='h-full sm:w-28 ' variant='blue'>
        Search
      </Button>
    </form>

    <div className='flex flex-col sm:flex-row gap-2' >
      <Select value={location} onValueChange ={(value)=> setLocation(value)} >
  <SelectTrigger>
    <SelectValue placeholder="Filter By Location " />
  </SelectTrigger>
  <SelectContent >
    {State.getStatesOfCountry('IN').map(({name})=>{
    return (
     <SelectItem key={name} value={name}>{name}</SelectItem>

   ) })}
    
   
  </SelectContent>
</Select>

  <Select value={company_id} onValueChange ={(value)=> setCompany_id(value)} >
  <SelectTrigger>
    <SelectValue placeholder="Filter By Companies " />
  </SelectTrigger>
  <SelectContent >
    {(companies|| []).map(({name,id})=>{
    return (
     <SelectItem key={name} value={id}>{name}</SelectItem>

   ) })}
    
   
  </SelectContent>
</Select>

<Button
  onClick={clearFilter}
  variant="destructive"
  className="sm:w-1/2  py-2 px-4 text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-xl shadow-md"
>
  Clear Filters
</Button>

    </div>

{
  loadingJobs && (
       <BarLoader className="mt-4" width="100%" color="#36d7b7" />
  )
}
{
  loadingJobs === false && (
    
    <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 ' > 
      {Jobs?.length ? (
 Jobs.map((job)=>{
  return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />

 })
      ) :(
         <div> No Jobs </div>
      )}
    </div>

  )
}

  </div>
  
}

export default Joblisting