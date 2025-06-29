import supabaseClient from "@/components/utils/supabase";

export async function getCompanies(token) {
   const supabase = await supabaseClient(token);
  

  const { data, error } = await supabase.from("companies").select('*');

  if(error){
    console.error("Error Deleting Saved Job:",error)
    return null;
  }
  return data;

}

