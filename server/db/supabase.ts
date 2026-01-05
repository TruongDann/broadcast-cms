import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface DbTopic {
  id: string
  title: string
  outline: string | null
  content_type: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  team_members: TeamMemberJson[]
  attachments: AttachmentJson[]
  estimated_days: number
  deadline: string | null
  created_by: string
  created_by_name: string | null
  department_id: string | null
  department_name: string | null
  status: 'draft' | 'pending' | 'revision_required' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface DbApprovalHistory {
  id: string
  topic_id: string
  user_id: string
  user_name: string | null
  user_role: string | null
  action: 'approve' | 'reject' | 'comment' | 'submit' | 'request_revision'
  level: 'B1' | 'B2' | 'B3' | null
  comment: string | null
  created_at: string
}

interface TeamMemberJson {
  userId: string
  userName: string
  role: string
  position: 'lead' | 'member' | 'support'
}

interface AttachmentJson {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
}
