import supabaseClient, { supabaseUrl } from "@/components/utils/supabase";


export async function getjobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  
  // ✅ changed from `let token` to `let query`
  let query = supabase.from('jobs').select('* , company:companies(name,logo_url),saved:saved_jobs(id)');

  if (location) {
    query = query.eq('location', location);
  }

  if (company_id) {
    query = query.eq('company_id', company_id);
  }

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching jobs:', error);
    return null;
  }

  return data;
}


export async function savejob(token, { alreadySaved }, { user_id, job_id }) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .match({ user_id, job_id });

    if (error) {
      console.error('Unsave job error:', error);
    }
    return []; // mark as unsaved
  } else {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([{ user_id, job_id }]);

    if (error) {
      console.error('Save job error:', error);
      return null;
    }

    return data;
  }
}



export async function getSingleJob(token,{job_id}) {
   const supabase = await supabaseClient(token);
  

  const { data, error } = await supabase.from("jobs").select('*,company:companies(name,logo_url),applications:applications(*)').eq('id',job_id).single();

  if(error){
    console.error("Error Fetching  Saved Job:",error)
    return null;
  }
  return data;

}

export async function updateHiringStatus(token,{job_id},isOpen) {
   const supabase = await supabaseClient(token);
  

  const { data, error } = await supabase.from("jobs").update({isOpen}).eq('id',job_id).select();

  if(error){
    console.error("Error updateing Saved Job:",error)
    return null;
  }
  return data;

}


export async function addNewJob(token,_,jobData) {
   const supabase = await supabaseClient(token);
  

  const { data, error } = await supabase.from("jobs").insert([jobData]).select();

  if(error){
    console.error("Error Creating a job :",error)
    return null;
  }
  return data;

}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  // 1. Upload the logo file to Storage
  const random = Math.floor(Math.random() * 90000);
  const filename = `logo-${random}-${companyData.name}`;
  const { error: storageError } = await supabase.storage
    .from('company-logo')
    .upload(filename, companyData.logo);

  if (storageError) {
    console.error("Error uploading company logo", storageError);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${filename}`;

  // 2. Only include fields you want to store in the table
  const newCompany = {
    name: companyData.name,
    logo_url,
  };

  const { data, error } = await supabase
    .from("companies")
    .insert([newCompany])
    .select();

  if (error) {
    console.error("Error submitting company:", error);
    return null;
  }

  return data;
}


export async function getSaveJob(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("id, user_id, job:jobs(*,company:companies(name,logo_url))");

  if (error) {
    console.error("Error Fetching Saved Jobs:", error);
    return [];
  }

  return data;
}


export async function getMyJobs(token,{ recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error Fetching My Jobs:", error);
    return [];
  }

  return data;
}


export async function DeleteJob(token,{ job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();
  

  if (error) {
    console.error("Error Deleting  Jobs:", error);
    return [];
  }

  return data;
}








