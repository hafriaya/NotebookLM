'use client'

import { useState } from 'react'
import { uploadStudyMaterial } from '@/actions/materials'
import { generateExam } from '@/actions/exam'
import { useRouter } from 'next/navigation'

interface CreateTestModalProps {
    isOpen: boolean
    onClose: () => void
    initialMaterialId?: string
    initialTitle?: string
}

export default function CreateTestModal({ isOpen, onClose, initialMaterialId, initialTitle }: CreateTestModalProps) {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
    const [examType, setExamType] = useState<'Conceptual' | 'Practical' | 'Mixed'>('Mixed')
    const [questionCount, setQuestionCount] = useState<number>(5)
    const [customPrompt, setCustomPrompt] = useState<string>('')
    const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'done'>('idle')
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleSubmit = async () => {
        if (!file && !initialMaterialId) {
            setError('Please select a file.')
            return
        }

        try {
            let materialId = initialMaterialId

            if (!materialId && file) {
                setStatus('uploading')
                const formData = new FormData()
                formData.append('file', file)

                const uploadRes = await uploadStudyMaterial(formData)
                if (!uploadRes.success) throw new Error('Upload failed')
                materialId = uploadRes.materialId
            }

            if (!materialId) throw new Error('No material ID avaiable')

            setStatus('generating')

            // Pass configuration to generateExam
            const examRes = await generateExam(materialId, difficulty, examType, questionCount, customPrompt)

            if (examRes.success) {
                setStatus('done')
                router.push(`/exam/${examRes.examId}`)
            }
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Something went wrong')
            setStatus('idle')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">New Practice Test</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {status === 'idle' && (
                    <div className="space-y-6">
                        {initialMaterialId ? (
                            <div className="text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="material-symbols-outlined text-4xl text-[var(--primary-blue)] mb-2">library_books</span>
                                <h4 className="font-bold text-gray-800">Generate from Library</h4>
                                <p className="text-sm text-gray-600 mt-1">Using: <span className="font-semibold">{initialTitle || 'Selected Material'}</span></p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.txt,.md"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-12 h-12 bg-indigo-50 text-[var(--primary-blue)] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined">upload_file</span>
                                </div>
                                {file ? (
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="font-medium text-gray-800">Click to upload study material</p>
                                        <p className="text-sm text-gray-500 mt-1">PDF, TXT, or MD (Max 10MB)</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Configuration Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Easy', 'Medium', 'Hard'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level as any)}
                                            className={`py-2 text-sm rounded-lg border ${difficulty === level
                                                ? 'bg-[var(--primary-blue)] text-white border-[var(--primary-blue)]'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                                    <select
                                        value={examType}
                                        onChange={(e) => setExamType(e.target.value as any)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="Conceptual">Conceptual</option>
                                        <option value="Practical">Practical</option>
                                        <option value="Mixed">Mixed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value={5}>5 Questions</option>
                                        <option value={10}>10 Questions</option>
                                        <option value={15}>15 Questions</option>
                                        <option value={20}>20 Questions</option>
                                    </select>
                                </div>
                            </div>

                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 list-none">
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-90 text-gray-400">chevron_right</span>
                                    Advanced Options
                                </summary>
                                <div className="mt-3 pl-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Custom Instructions (Optional)</label>
                                    <textarea
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder='e.g., "Focus on legal dates", "Only usage of dates"'
                                        maxLength={500}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent outline-none resize-none"
                                    />
                                    <p className="text-xs text-right text-gray-400 mt-1">{customPrompt.length}/500</p>
                                </div>
                            </details>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!file && !initialMaterialId}
                            className="w-full py-3 bg-[var(--primary-blue)] text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                        >
                            {initialMaterialId ? 'Generate Exam' : 'Upload & Generate'}
                        </button>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-[var(--primary-blue)] rounded-full animate-spin mx-auto mb-4"></div>
                        <h4 className="font-bold text-gray-800">Uploading Material...</h4>
                        <p className="text-sm text-gray-500 mt-2">Securely processing your document.</p>
                    </div>
                )}

                {status === 'generating' && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        </div>
                        <h4 className="font-bold text-gray-800">AI Generating Questions...</h4>
                        <p className="text-sm text-gray-500 mt-2">Creating {questionCount} {difficulty.toLowerCase()} questions...</p>
                    </div>
                )}

                {status === 'done' && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-2xl">check_circle</span>
                        </div>
                        <h4 className="font-bold text-gray-800">Ready!</h4>
                        <p className="text-sm text-gray-500 mt-2">Redirecting to exam...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
