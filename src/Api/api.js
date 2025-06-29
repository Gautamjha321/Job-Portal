import supabaseClient from "@/components/utils/supabase";

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