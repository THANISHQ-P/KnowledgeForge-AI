import supabase from "../config/supabase.js";

export async function searchKnowledge(question){

    const {data,error}=await supabase

    .from("knowledge")

    .select("*");

    if(error) throw error;

    const q=question.toLowerCase();

    const best=data.find(item=>

        item.extracted_text &&

        item.extracted_text.toLowerCase().includes(q)

    );

    return best;

}