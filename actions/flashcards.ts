'use server'

import { createClient } from '@/utils/supabase/server'
import { generateMockFlashcards } from '@/lib/ai-stub'

export async function generateFlashcards(examId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Mock ID for dev if needed, or throw error
        // throwing error is better for actions usually, but let's be consistent with other actions
    }
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'

    // 1. Fetch Exam to get title/content context
    const { data: exam } = await supabase
        .from('exams')
        .select('title')
        .eq('id', examId)
        .single()

    const examTitle = exam?.title || 'Exam Review'

    // 2. Generate Flashcards via AI (Stub)
    const flashcardsContent = await generateMockFlashcards("mock-content-from-exam")

    // 3. Create Flashcard Set
    const { data: set, error: setError } = await supabase
        .from('flashcard_sets')
        .insert({
            user_id: userId,
            exam_source_id: examId,
            title: `Study Set: ${examTitle}`
        })
        .select()
        .single()

    if (setError) throw new Error(`Failed to create set: ${setError.message}`)

    // 4. Insert Flashcards
    const cardsToInsert = flashcardsContent.map(card => ({
        set_id: set.id,
        front: card.front,
        back: card.back
    }))

    const { error: cardsError } = await supabase
        .from('flashcards')
        .insert(cardsToInsert)

    if (cardsError) throw new Error(`Failed to insert cards: ${cardsError.message}`)

    return { success: true, setId: set.id }
}

export async function getFlashcardSet(setId: string) {
    const supabase = await createClient()

    // Fetch Set Details
    const { data: set, error: setError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('id', setId)
        .single()

    if (setError) return { error: setError.message }

    // Fetch Cards
    const { data: cards, error: cardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('set_id', setId)
        .order('id') // Consistent order

    if (cardsError) return { error: cardsError.message }

    return { set, cards }
}

export async function updateFlashcardMastery(cardId: string, isMastered: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('flashcards')
        .update({ is_mastered: isMastered })
        .eq('id', cardId)

    if (error) throw new Error(error.message)
    return { success: true }
}
