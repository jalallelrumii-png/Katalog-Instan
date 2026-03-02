import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://ggehijzremqynprhwjbg.supabase.co'
const supabaseAnonKey = 'sb_publishable_IKSyrmJz-FWYS2esN7WUUw_1tn3J-xq'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
