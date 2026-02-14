
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eivscitvpemyxjwlszna.supabase.co'
const supabaseKey = 'sb_publishable_XPjUwmQMJ1bikmeivwSZMg_EpKre3Cu'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkExams() {
    console.log('--- Checking Exams Table ---')

    // 1. Check for recent exams
    const { data: exams, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error fetching exams:', error)
        return
    }

    if (exams.length === 0) {
        console.log('No exams found.')
        return
    }

    console.log(`Found ${exams.length} recent exams:`)
    exams.forEach(e => {
        console.log(`- ID: ${e.id}`)
        console.log(`  User ID: ${e.user_id}`)
        console.log(`  Title: ${e.title}`)
        console.log(`  Status: ${e.status}`)
        console.log(`  Score: ${e.score} (Type: ${typeof e.score})`)
        // Check if user_answers column exists by seeing if it's in the returned object
        console.log(`  User Answers Present: ${'user_answers' in e}`)
        console.log('--------------------------------')
    })
}

checkExams()
