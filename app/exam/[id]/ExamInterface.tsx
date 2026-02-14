'use client'

import { useState, useEffect } from 'react'
import { submitExam } from '@/actions/exam'
import { useRouter } from 'next/navigation'

interface Question {
    id: string
    question_text: string
    options: string[] | { id: string; text: string }[] // Handling both JSON array of strings or objects
    order_index: number
}

interface ExamInterfaceProps {
    exam: {
        id: string
        title: string
        difficulty: string
    }
    questions: Question[]
}

export default function ExamInterface({ exam, questions }: ExamInterfaceProps) {
    const router = useRouter()
    const [timeLeft, setTimeLeft] = useState(2700) // 45 mins default
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [flagged, setFlagged] = useState<Set<string>>(new Set())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [isPaused])

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }

    const currentQuestion = questions[activeQuestionIndex]

    // Normalize options to ensure they are objects with id/text
    const currentOptions = Array.isArray(currentQuestion.options)
        ? currentQuestion.options.map((opt: any, idx) => {
            if (typeof opt === 'string') return { id: opt, text: opt }
            return { id: opt.id || String(idx), text: opt.text || opt } // Fallback
        })
        : []

    const handleSelectAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }))
    }

    const toggleFlag = (questionId: string) => {
        setFlagged(prev => {
            const next = new Set(prev)
            if (next.has(questionId)) next.delete(questionId)
            else next.add(questionId)
            return next
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            await submitExam(exam.id, answers)
            router.push(`/exam/${exam.id}/results`)
        } catch (error) {
            console.error('Failed to submit exam:', error)
            alert('Failed to submit exam. Please try again.')
            setIsSubmitting(false)
        }
    }

    const handleQuit = () => {
        if (confirm("Are you sure you want to quit? Your progress will not be saved.")) {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] font-sans overflow-hidden relative">
            {/* Pause Overlay */}
            {isPaused && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-8">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-[var(--primary-blue)]">pause</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Paused</h2>
                        <p className="text-gray-500 mb-8">Take a breather. Your time is paused.</p>
                        <button
                            onClick={() => setIsPaused(false)}
                            className="w-full py-4 bg-[var(--primary-blue)] text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-transform hover:scale-[1.02] shadow-lg shadow-indigo-200"
                        >
                            Resume Exam
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-[var(--text-main)]">{exam.title}</h1>
                    <span className="h-5 w-px bg-gray-300 mx-2"></span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Difficulty: {exam.difficulty}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100'}`}>
                        <span className="material-symbols-outlined text-[20px]">timer</span>
                        <span className="font-mono font-semibold text-slate-800 text-lg">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={() => setIsPaused(true)}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[20px] fill-0">pause_circle</span>
                        Pause
                    </button>
                    <button
                        onClick={handleQuit}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-sm font-medium border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Quit
                    </button>
                </div>
            </header>

            <div className={`flex flex-1 overflow-hidden transition-opacity duration-300 ${isPaused ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full relative overflow-y-auto scrollbar-hide">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-100 shrink-0">
                        <div
                            className="h-full bg-[var(--primary-blue)] transition-all duration-300"
                            style={{ width: `${((Object.keys(answers).length) / questions.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="max-w-4xl mx-auto w-full px-8 py-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                    Question {activeQuestionIndex + 1} of {questions.length}
                                </span>
                            </div>
                            <button
                                onClick={() => toggleFlag(currentQuestion.id)}
                                className={`flex items-center gap-2 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border ${flagged.has(currentQuestion.id)
                                    ? 'text-[var(--warning-amber)] bg-amber-50 border-amber-100'
                                    : 'text-slate-500 hover:text-[var(--warning-amber)] border-transparent hover:bg-amber-50'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${flagged.has(currentQuestion.id) ? 'fill-1' : 'fill-0'}`}>flag</span>
                                {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for Review'}
                            </button>
                        </div>

                        <div className="prose prose-lg max-w-none text-[var(--text-main)] mb-8 leading-relaxed">
                            <p className="text-xl font-medium">
                                {currentQuestion.question_text}
                            </p>
                        </div>

                        <div className="space-y-4 mb-12">
                            {currentOptions.map((option) => (
                                <label key={option.id} className="block cursor-pointer group">
                                    <input
                                        className="radio-option hidden"
                                        name={`question_${currentQuestion.id}`}
                                        type="radio"
                                        value={option.id}
                                        checked={answers[currentQuestion.id] === option.id}
                                        onChange={() => handleSelectAnswer(currentQuestion.id, option.id)}
                                    />
                                    <div className={`flex items-center p-4 rounded-xl border-2 transition-all bg-[var(--bg-surface)] ${answers[currentQuestion.id] === option.id
                                        ? 'border-[var(--primary-blue)] bg-blue-50 shadow-[0_0_0_1px_var(--primary-blue)]'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-slate-50'
                                        }`}>
                                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mr-4 radio-indicator shrink-0 transition-colors ${answers[currentQuestion.id] === option.id
                                            ? 'bg-[var(--primary-blue)] border-[var(--primary-blue)]'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            <span className={`text-white font-bold text-sm material-symbols-outlined text-[18px] ${answers[currentQuestion.id] === option.id ? 'opacity-100' : 'opacity-0'
                                                }`}>check</span>
                                        </div>
                                        <span className="text-base text-gray-700 font-medium">{option.text}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex-grow"></div>
                    </div>

                    <div className="sticky bottom-0 w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-8 py-4 flex items-center justify-between z-10">
                        <button
                            onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={activeQuestionIndex === 0}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-slate-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Previous
                        </button>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-slate-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Skip Question
                            </button>
                            <button
                                onClick={() => {
                                    if (activeQuestionIndex < questions.length - 1) {
                                        setActiveQuestionIndex(prev => prev + 1)
                                    } else {
                                        // Submit if last question? or just scroll?
                                        // Usually 'Next' on last question loops or does nothing.
                                        // We'll keep it simple: Next moves, Submit is separate button.
                                    }
                                }}
                                disabled={activeQuestionIndex === questions.length - 1}
                                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[var(--primary-blue)] text-white font-medium hover:bg-[var(--primary-dark)] shadow-sm shadow-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-80 bg-[var(--bg-surface)] border-l border-[var(--border-color)] flex flex-col shrink-0 h-full">
                    <div className="p-6 border-b border-[var(--border-color)]">
                        <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide mb-4">Question Navigator</h2>
                        <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[var(--primary-blue)]"></div>
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[var(--warning-amber)]"></div>
                                <span>Flagged</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full border border-gray-300 bg-white"></div>
                                <span>Unseen</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, index) => {
                                const qId = q.id;
                                const isAnswered = !!answers[qId];
                                const isFlagged = flagged.has(qId);
                                const isCurrent = index === activeQuestionIndex;

                                let style = "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                if (isAnswered) style = "bg-blue-50 border-blue-200 text-[var(--primary-blue)] hover:bg-blue-100"
                                if (isFlagged) style = "bg-amber-50 border-amber-200 text-[var(--warning-amber)] hover:bg-amber-100 relative"
                                if (isCurrent) style = "bg-[var(--primary-blue)] text-white font-bold shadow-md shadow-blue-200 ring-2 ring-offset-2 ring-blue-500 border-transparent"

                                return (
                                    <button
                                        key={qId}
                                        onClick={() => setActiveQuestionIndex(index)}
                                        className={`h-10 w-10 rounded-lg border font-medium text-sm flex items-center justify-center transition-colors ${style}`}
                                    >
                                        {index + 1}
                                        {isFlagged && (
                                            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-[var(--warning-amber)] rounded-full border-2 border-white"></span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="p-6 border-t border-[var(--border-color)] bg-slate-50 mt-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : 'Submit Exam'}

                        </button>
                        <p className="text-xs text-center text-slate-400 mt-3">All progress is saved automatically.</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
