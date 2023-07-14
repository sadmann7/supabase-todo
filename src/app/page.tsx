import { Shell } from "@/components/shell";
import { supabase } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabaseAuth = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  const { data } = await supabase.from("todos").select();

  console.log(data);

  return <Shell></Shell>;
}
