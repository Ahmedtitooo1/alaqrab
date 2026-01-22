
import { Question, QuestionType } from '../../types';

export const generateSmartExam = async (prompt: string, count: number = 5): Promise<Question[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isPhysics = prompt.includes('فيزياء') || prompt.includes('تيار') || prompt.includes('مقاومة');
    const isMath = prompt.includes('رياضيات') || prompt.includes('جبر') || prompt.includes('تفاضل');

    if (isPhysics) {
        return [
            {
                id: 'q-ai-1',
                type: QuestionType.SINGLE_CHOICE,
                text: 'ما هي وحدة قياس شدة التيار الكهربي؟', // What is the unit of electric current intensity?
                points: 5,
                correctAnswer: 'op2',
                options: [
                    { id: 'op1', text: 'الجول (J)' },
                    { id: 'op2', text: 'الأمبير (A)' },
                    { id: 'op3', text: 'الفولت (V)' },
                    { id: 'op4', text: 'الأوم (Ω)' }
                ]
            },
            {
                id: 'q-ai-2',
                type: QuestionType.TRUE_FALSE,
                text: 'تعتبر المقاومة النوعية صفة مميزة للمادة وتتوقف على درجة الحرارة.',
                points: 5,
                correctAnswer: 'true',
                options: [{ id: 'true', text: 'صواب' }, { id: 'false', text: 'خطأ' }]
            },
            {
                id: 'q-ai-3',
                type: QuestionType.SHORT_ESSAY,
                text: 'اشرح الفكرة العلمية التي بني عليها قانون أوم.',
                points: 10,
                correctAnswer: ''
            },
            {
                id: 'q-ai-4',
                type: QuestionType.SINGLE_CHOICE,
                text: 'في الدائرة الكهربية المغلقة، إذا زادت المقاومة الخارجية للضعف، فإن فرق الجهد بين قطبي المصدر...',
                points: 5,
                correctAnswer: 'op1',
                options: [
                    { id: 'op1', text: 'يزداد' },
                    { id: 'op2', text: 'يقل' },
                    { id: 'op3', text: 'لا يتغير' },
                    { id: 'op4', text: 'ينعدم' }
                ]
            },
            {
                id: 'q-ai-5',
                type: QuestionType.SINGLE_CHOICE,
                text: 'جهاز يستخدم لقياس فرق الجهد الكهربي في الدوائر الكهربية',
                points: 5,
                correctAnswer: 'op3',
                options: [
                    { id: 'op1', text: 'الأميتر' },
                    { id: 'op2', text: 'الأوميتر' },
                    { id: 'op3', text: 'الفولتميتر' },
                    { id: 'op4', text: 'الجلفانومتر' }
                ]
            }
        ];
    }

    if (isMath) {
        return [
            {
                id: 'q-ai-m1',
                type: QuestionType.SINGLE_CHOICE,
                text: 'مشتقة الدالة f(x) = x^2 هي:',
                points: 5,
                correctAnswer: 'op1',
                options: [
                    { id: 'op1', text: '2x' },
                    { id: 'op2', text: 'x' },
                    { id: 'op3', text: '2' },
                    { id: 'op4', text: 'x^2' }
                ]
            },
            // Add more Math questions if needed
        ];
    }

    // Default Generic Questions (Fallback)
    return [
        {
            id: 'q-ai-gen-1',
            type: QuestionType.SINGLE_CHOICE,
            text: 'سؤال مولد بالذكاء الاصطناعي (عام)',
            points: 5,
            correctAnswer: 'op1',
            options: [
                { id: 'op1', text: 'الخيار الأول الصحيح' },
                { id: 'op2', text: 'خيار بديل 1' },
                { id: 'op3', text: 'خيار بديل 2' },
                { id: 'op4', text: 'خيار بديل 3' }
            ]
        },
        {
            id: 'q-ai-gen-2',
            type: QuestionType.TRUE_FALSE,
            text: 'هل الذكاء الاصطناعي يمكنه توليد أسئلة دقيقة 100% دائماً؟',
            points: 5,
            correctAnswer: 'false',
            options: [{ id: 'true', text: 'أكيد' }, { id: 'false', text: 'ليس دائماً' }]
        }
    ];
};

export const analyzeExamPaper = async (image: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Mock OCR Result
    return {
        score: 85,
        detectedStudentName: 'أحمد محمد علي',
        examCode: 'EX-PHYS-101',
        answers: [
            { question: 1, correct: true },
            { question: 2, correct: true },
            { question: 3, correct: false },
            { question: 4, correct: true },
            { question: 5, correct: true }
        ]
    };
};
