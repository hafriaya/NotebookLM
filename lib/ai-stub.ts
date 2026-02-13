export async function mockGenerateQuestions(topic: string, count: number) {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 2000))

    return [
        {
            question_text: "Which of the following best describes the function of the mitochondria?",
            options: ["Protein synthesis", "Energy production (ATP)", "Photosynthesis", "Cell division"],
            correct_answer: "Energy production (ATP)",
            explanation: "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
        },
        {
            question_text: "In the equation E = mc^2, what does 'c' represent?",
            options: ["Energy", "Mass", "Speed of light", "Gravity"],
            correct_answer: "Speed of light",
            explanation: "In Einstein's mass-energy equivalence formula, 'c' stands for the speed of light in a vacuum, which is approximately 3.00 x 10^8 meters per second."
        },
        {
            question_text: "What is the primary product of the Calvin cycle in photosynthesis?",
            options: ["Oxygen", "Carbon dioxide", "G3P (sugar precursor)", "ATP"],
            correct_answer: "G3P (sugar precursor)",
            explanation: "The Calvin cycle takes CO2 and energy from ATP/NADPH to produce Glyceraldehyde-3-phosphate (G3P), which can be converted into glucose and other sugars."
        },
        {
            question_text: "Solve for x: 2x + 5 = 13",
            options: ["3", "4", "5", "6"],
            correct_answer: "4",
            explanation: "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4."
        },
        {
            question_text: "Which process involves the movement of water across a semi-permeable membrane?",
            options: ["Diffusion", "Active Transport", "Osmosis", "Facilitated Diffusion"],
            correct_answer: "Osmosis",
            explanation: "Osmosis is the specific term for the diffusion of water molecules across a semi-permeable membrane from an area of higher water concentration to an area of lower water concentration."
        }
    ]
}

export async function generateMockExam(materialId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate 2s latency

    return {
        title: "Mock Exam: Key Concepts",
        questions: [
            {
                text: "What is the primary function of the mitochondria?",
                options: ["Energy production", "Protein synthesis", "Waste disposal", "Cell division"],
                correctAnswer: 0,
                explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
            },
            {
                text: "Which of the following is NOT a state of matter?",
                options: ["Solid", "Liquid", "Gas", "Energy"],
                correctAnswer: 3,
                explanation: "Energy is a property of objects, not a state of matter like solid, liquid, gas, or plasma."
            },
            {
                text: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correctAnswer: 1,
                explanation: "William Shakespeare wrote the tragedy 'Romeo and Juliet' early in his career."
            },
            {
                text: "What is the chemical symbol for Gold?",
                options: ["Au", "Ag", "Fe", "Cu"],
                correctAnswer: 0,
                explanation: "The chemical symbol for Gold is Au, from the Latin word 'aurum'."
            },
            {
                text: "Solve for x: 2x + 5 = 15",
                options: ["5", "10", "2.5", "7.5"],
                correctAnswer: 0,
                explanation: "Subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5."
            }
        ]
    }
}

export async function generateMockFlashcards(content: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate 1.5s latency

    return [
        {
            front: "Mitochondria",
            back: "Organelle responsible for energy production (ATP) in the cell."
        },
        {
            front: "Photosynthesis",
            back: "Process used by plants to convert light energy into chemical energy."
        },
        {
            front: "Mitosis",
            back: "Type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus."
        },
        {
            front: "Osmosis",
            back: "Spontaneous net movement of solvent molecules through a selectively permeable membrane into a region of higher solute concentration."
        },
        {
            front: "Enzyme",
            back: "A substance produced by a living organism which acts as a catalyst to bring about a specific biochemical reaction."
        }
    ]
}
