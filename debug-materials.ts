
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLatestMaterial() {
    console.log('Fetching latest study material...')

    const { data, error } = await supabase
        .from('study_materials')
        .select('id, title, processed_text_content, created_at')
        .order('created_at', { ascending: false })
        .limit(1)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (!data || data.length === 0) {
        console.log('No materials found.')
        return
    }

    const material = data[0]
    console.log('--- Latest Material ---')
    console.log('ID:', material.id)
    console.log('Title:', material.title)
    console.log('Created At:', material.created_at)
    console.log('Content Length:', material.processed_text_content ? material.processed_text_content.length : 0)
    console.log('Content Preview:', material.processed_text_content ? material.processed_text_content.substring(0, 100) : 'NULL')
}

checkLatestMaterial()
