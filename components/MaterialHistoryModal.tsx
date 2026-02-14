'use client'

import { useState, useEffect } from 'react'
import { getMaterialExamHistory } from '@/actions/materials'
import { retakeExam } from '@/actions/exam'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MaterialHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    materialId: string
    materialTitle: string
}

export default function MaterialHistoryModal({ isOpen, onClose, materialId, materialTitle }: MaterialHistoryModalProps) {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            getMaterialExamHistory(materialId)
                .then(data => {
                    setHistory(data || [])
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [isOpen, materialId])

    const handleRetake = async (examId: string) => {
        try {
            const res = await retakeExam(examId)
            if (res.success) {
                router.push(`/exam/${res.newExamId}`)
            }
        } catch (e) {
            alert('Failed to start retake')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Exam History</h3>
                        <p className="text-sm text-gray-500 truncate max-w-md">{materialTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <span className="material-symbols-outlined animate-spin text-3xl mb-2">refresh</span>
                            <p>Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                            <p>No exams taken for this material yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((exam) => (
                                <div key={exam.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${exam.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {exam.status}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(exam.created_at).toLocaleDateString()} at {new Date(exam.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="font-medium text-gray-800 flex items-center gap-2">
                                            {exam.title}
                                            {exam.difficulty && <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">{exam.difficulty}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                        {exam.score !== null && (
                                            <div className="flex flex-col items-center px-3">
                                                <span className="text-xl font-bold text-gray-800">{exam.score}%</span>
                                                <span className="text-[10px] text-gray-400 uppercase">Score</span>
                                            </div>
                                        )}

                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {exam.status === 'completed' ? (
                                                <>
                                                    <Link
                                                        href={`/exam/${exam.id}/results`}
                                                        className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
                                                    >
                                                        Review
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRetake(exam.id)}
                                                        className="flex-1 sm:flex-none px-3 py-2 bg-indigo-50 text-[var(--primary-blue)] rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                                                        Retake
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    href={`/exam/${exam.id}`}
                                                    className="flex-1 sm:flex-none px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                                                >
                                                    Continue
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-50 bg-gray-50 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
