'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { generateFlashcards } from '@/actions/flashcards'
import { useState } from 'react'

interface Question {
    id: string
    question_text: string
    options: string[]
    correct_answer: string
    explanation: string
    user_answer?: string
}

interface ExamResult {
    id: string
    title: string
    created_at: string
    score: number | null
    questions: Question[]
}

interface ResultsClientProps {
    exam: ExamResult
}

export default function ResultsClient({ exam }: ResultsClientProps) {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerateFlashcards = async () => {
        setIsGenerating(true)
        try {
            const result = await generateFlashcards(exam.id)
            if (result.success) {
                router.push(`/flashcards/${result.setId}`)
            }
        } catch (error) {
            console.error('Failed to generate flashcards', error)
            alert('Failed to generate flashcards: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setIsGenerating(false)
        }
    }

    const correctCount = exam.questions.filter(q => q.user_answer === q.correct_answer).length
    const incorrectCount = exam.questions.filter(q => q.user_answer && q.user_answer !== q.correct_answer).length
    const skippedCount = exam.questions.filter(q => !q.user_answer).length

    return (
        <div className="min-h-screen flex flex-col bg-[var(--secondary-bg)] font-sans text-[var(--text-main)]">
            <nav className="bg-[var(--surface-color)] border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">school</span>
                            <span className="font-bold text-xl tracking-tight text-[var(--text-main)]">ExamSim AI</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)]" href="/dashboard">Dashboard</Link>
                            <Link className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)]" href="/dashboard/materials">My Library</Link>
                            <Link className="text-sm font-medium text-[var(--text-main)] border-b-2 border-[var(--primary-color)]" href="#">Results</Link>
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-[var(--primary-color)] font-bold text-xs">JD</div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-1">
                            <span>AP Biology</span>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span>{exam.title}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-main)]">Test Results Analysis</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Completed on {new Date(exam.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                const { retakeExam } = await import('@/actions/exam')
                                try {
                                    const res = await retakeExam(exam.id)
                                    if (res.success) router.push(`/exam/${res.newExamId}`)
                                } catch (e) {
                                    alert('Failed to start retake')
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Retake Exam
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">share</span>
                            Share Results
                        </button>
                        <button
                            onClick={handleGenerateFlashcards}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] shadow-sm transition-colors shadow-indigo-200 disabled:opacity-70 disabled:cursor-wait"
                        >
                            <span className="material-symbols-outlined text-[18px]">{isGenerating ? 'hourglass_empty' : 'bolt'}</span>
                            {isGenerating ? 'Generating...' : 'Generate Review Flashcards'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[var(--surface-color)] rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-6">Overall Score</h2>
                            <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6 shadow-inner" style={{ background: `conic-gradient(var(--success-color) ${exam.score || 0}%, #E5E7EB 0)` }}>
                                <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-5xl font-extrabold text-[var(--text-main)]">{exam.score}%</span>
                                    <span className="text-sm font-medium text-[var(--success-color)] mt-1">
                                        {(exam.score || 0) >= 80 ? 'Great Job!' : (exam.score || 0) >= 60 ? 'Good Effort' : 'Keep Studying'}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 w-full border-t border-gray-100 pt-6 mt-2">
                                <div>
                                    <div className="text-2xl font-bold text-[var(--text-main)]">{correctCount}</div>
                                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Correct</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--error-color)]">{incorrectCount}</div>
                                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Incorrect</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--text-secondary)]">{skippedCount}</div>
                                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Skipped</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-[var(--surface-color)] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-lg font-semibold text-[var(--text-main)]">Detailed Question Review</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {exam.questions.map((q, index) => {
                                    const isCorrect = q.user_answer === q.correct_answer
                                    return (
                                        <details key={q.id} className="group bg-white">
                                            <summary className={`flex items-start gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors list-none ${!isCorrect && q.user_answer ? 'bg-red-50/30' : ''}`}>
                                                <div className="mt-1 flex-shrink-0">
                                                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${isCorrect ? 'bg-green-100 text-[var(--success-color)]' : 'bg-red-100 text-[var(--error-color)]'}`}>
                                                        <span className="material-symbols-outlined text-sm font-bold">{isCorrect ? 'check' : 'close'}</span>
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-sm font-medium text-[var(--text-main)] pr-4">Q{index + 1}. {q.question_text}</h3>
                                                        <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform">expand_more</span>
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] mt-1 truncate group-open:hidden">Your Answer: {q.user_answer || 'Skipped'}</p>
                                                </div>
                                            </summary>
                                            <div className={`px-5 pb-5 pl-14 text-sm text-[var(--text-secondary)] ${!isCorrect ? 'bg-red-50/30' : ''}`}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className={`p-3 rounded-lg border ${!isCorrect ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                                        <p className={`text-xs font-semibold uppercase mb-1 ${!isCorrect ? 'text-red-600' : 'text-green-600'}`}>Your Answer</p>
                                                        <p className={`font-medium ${!isCorrect ? 'text-red-900' : 'text-green-900'}`}>{q.user_answer || 'Skipped'}</p>
                                                    </div>
                                                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                                        <p className="text-xs font-semibold text-green-600 uppercase mb-1">Correct Answer</p>
                                                        <p className="font-medium text-green-900">{q.correct_answer}</p>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <h4 className="flex items-center gap-2 font-semibold text-[var(--text-main)] mb-2">
                                                        <span className="material-symbols-outlined text-indigo-500 text-lg">auto_awesome</span>
                                                        AI Explanation
                                                    </h4>
                                                    <p className="leading-relaxed">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </details>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
