import { Database } from "@/types/supabase"

export type Todo = Database["public"]["Tables"]["todos"]["Row"]
