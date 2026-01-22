import { GoogleGenAI, Type } from "@google/genai";
import { UserRole } from "../types";

const getApiKey = () => {
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || "";
};

/**
 * التصنيف المحاسبي الذكي
 * يقوم بتحليل وصف المعاملة واقتراح الكود المحاسبي المناسب ونوع الحركة
 */
// MOCK FALLBACKS
const mockExam: any = {
  title: "اختبار تجريبي (محاكاة)",
  description: "تم توليد هذا الاختبار بشكل افتراضي لأن مفتاح الذكاء الاصطناعي غير متوفر.",
  questions: [
    { type: "single_choice", text: "ما هي وحدة قياس القوة؟", points: 5, options: [{ id: "1", text: "نيوتن" }, { id: "2", text: "جول" }], correctAnswer: "1" },
    { type: "true_false", text: "تدور الأرض حول الشمس", points: 5, correctAnswer: "true", options: [{ id: "true", text: "صواب" }, { id: "false", text: "خطأ" }] }
  ]
};

const mockAnalysis = {
  detectedStudentName: "أحمد محمد (تجريبي)",
  totalScore: 85,
  maxScore: 100,
  analysis: [
    { questionNumber: 1, questionText: "السؤال الأول", studentAnswer: "إجابة الطالب", isCorrect: true, pointsAwarded: 10, feedback: "أحسنت" }
  ]
};

/**
 * التصنيف المحاسبي الذكي
 */
export const classifyFinancialTransaction = async (description: string, type: 'spending' | 'deposit') => {
  const apiKey = getApiKey();
  if (!apiKey) return { suggestedAccountCode: type === 'spending' ? '5101' : '4101', accountName: 'حساب عام (افتراضي)', category: 'عام', confidence: 0.5 };

  const ai = new GoogleGenAI({ apiKey });
  const schema = {
    type: Type.OBJECT,
    properties: {
      suggestedAccountCode: { type: Type.STRING },
      accountName: { type: Type.STRING },
      category: { type: Type.STRING },
      confidence: { type: Type.NUMBER }
    },
    required: ["suggestedAccountCode", "accountName", "category"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `حلل هذه العملية المالية (${type === 'spending' ? 'صرف' : 'إيداع'}): "${description}" واقترح الحساب المحاسبي.`,
      config: {
        systemInstruction: "أنت خبير محاسبي. أرجع النتيجة كـ JSON.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Classification Error:", error);
    return null;
  }
};

/**
 * وظيفة عامة للحصول على تحليلات ذكية
 */
export const getSmartAnalysis = async (role: UserRole, context: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "هذا تحليل افتراضي نظراً لعدم توفر مفتاح الذكاء الاصطناعي. يرجى إضافة المفتاح في الإعدادات لتفعيل التحليل الحقيقي.";

  const ai = new GoogleGenAI({ apiKey });
  let systemInstruction = "";

  switch (role) {
    case UserRole.ADMIN: systemInstruction = `أنت المحلل الإداري لنظام العقرب.`; break;
    case UserRole.TEACHER: systemInstruction = `أنت المعلم التحليلي.`; break;
    case UserRole.ACCOUNTANT: systemInstruction = `أنت المراقب المالي.`; break;
    default: systemInstruction = "أنت مساعد ذكي.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: context,
      config: { systemInstruction, temperature: 0.8 },
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "عذراً، حدث خطأ في التحليل.";
  }
};

/**
 * تقييم الإجابات المقالية القصيرة
 */
export const evaluateEssayAnswer = async (question: string, studentAnswer: string, points: number) => {
  const apiKey = getApiKey();
  if (!apiKey) return { isCorrect: true, pointsAwarded: points, feedback: "تقييم تلقائي لعدم توفر المفتاح." };

  const ai = new GoogleGenAI({ apiKey });
  const schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      pointsAwarded: { type: Type.NUMBER },
      feedback: { type: Type.STRING }
    },
    required: ["isCorrect", "pointsAwarded", "feedback"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `السؤال: ${question}\nالإجابة: ${studentAnswer}\nالدرجة: ${points}`,
      config: {
        systemInstruction: "قيم الإجابة وأرجع JSON.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { isCorrect: false, pointsAwarded: 0, feedback: "فشل التحليل." };
  }
};

/**
 * المصحح الذكي
 */
export const analyzeExamPaper = async (imageBase64: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return mockAnalysis;

  const ai = new GoogleGenAI({ apiKey });
  // ... Schema definition remains same ...
  const correctionSchema = {
    type: Type.OBJECT,
    properties: {
      detectedStudentName: { type: Type.STRING },
      totalScore: { type: Type.NUMBER },
      maxScore: { type: Type.NUMBER },
      analysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionNumber: { type: Type.NUMBER },
            questionText: { type: Type.STRING },
            studentAnswer: { type: Type.STRING },
            correctAnswer: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN },
            pointsAwarded: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          }
        }
      }
    },
    required: ["detectedStudentName", "totalScore", "maxScore", "analysis"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro", // Updated model name
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] } },
          { text: "حلل ورقة الإجابة" }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: correctionSchema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};

/**
 * المعلم الذكي
 */
export const getSmartTutorResponse = async (question: string, imageBase64?: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "أهلاً بك! أنا المعلم الذكي. (تنبيه: مفتاح الـ API غير مفعل، لذا هذه رسالة تلقائية). يرجى تفعيل المفتاح للحصول على إجابات حقيقية.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const parts: any[] = [{ text: question }];
    if (imageBase64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] } });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { parts },
      config: { systemInstruction: "أنت معلم فيزياء ودود." }
    });
    return response.text;
  } catch (error) {
    return "واجهت مشكلة في الاتصال.";
  }
};

export const generateSmartExam = async (prompt: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return mockExam;

  // Define Schema inline or here
  const EXAM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            text: { type: Type.STRING },
            points: { type: Type.NUMBER },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "text"]
              }
            },
            correctAnswer: { type: Type.STRING }
          },
          required: ["type", "text", "points", "correctAnswer"]
        }
      }
    },
    required: ["title", "questions"]
  };

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: prompt,
      config: {
        systemInstruction: "ولد اختبار JSON.",
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA,
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return mockExam;
  }
};
