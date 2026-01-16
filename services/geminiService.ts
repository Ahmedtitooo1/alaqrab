
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole } from "../types";

/**
 * التصنيف المحاسبي الذكي
 * يقوم بتحليل وصف المعاملة واقتراح الكود المحاسبي المناسب ونوع الحركة
 */
export const classifyFinancialTransaction = async (description: string, type: 'spending' | 'deposit') => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
      suggestedAccountCode: { type: Type.STRING, description: "كود الحساب المقترح من شجرة الحسابات" },
      accountName: { type: Type.STRING, description: "اسم الحساب باللغة العربية" },
      category: { type: Type.STRING, description: "تصنيف الحركة: رواتب، مشتريات، إيرادات، إلخ" },
      confidence: { type: Type.NUMBER, description: "نسبة التأكد من 0 إلى 1" }
    },
    required: ["suggestedAccountCode", "accountName", "category"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذه العملية المالية (${type === 'spending' ? 'صرف' : 'إيداع'}): "${description}" واقترح الحساب المحاسبي الأنسب.`,
      config: {
        systemInstruction: "أنت خبير محاسبي في نظام العقرب. وظيفتك تصنيف العمليات المالية بدقة. المصاريف تبدأ بـ 5، الإيرادات بـ 4، الأصول بـ 1، الخصوم بـ 2. أرجع النتيجة كـ JSON.",
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
 * وظيفة عامة للحصول على تحليلات ذكية بناءً على الدور والسياق
 */
export const getSmartAnalysis = async (role: UserRole, context: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });
  let systemInstruction = "";

  switch (role) {
    case UserRole.ADMIN:
      systemInstruction = `أنت "المحلل الإداري الذكي" لنظام العقرب. حلل البيانات الإدارية، اقترح خططاً لتحسين الأداء، ركز على الإنتاجية وتطوير المؤسسة.`;
      break;
    case UserRole.TEACHER:
      systemInstruction = `أنت "المعلم التحليلي الذكي". مهمتك: تحليل مستويات الأسئلة، اقتراح تحسينات، وشرح كيفية توزيع الأسئلة لمنع الغش.`;
      break;
    case UserRole.ACCOUNTANT:
      systemInstruction = `أنت "المراقب المالي الذكي". مهمتك مراقبة السيولة، كشف الخلل في القيود، واقتراح طرق لتقليل المصروفات التشغيلية.`;
      break;
    case UserRole.STUDENT:
      systemInstruction = `أنت "المرشد الدراسي الذكي". مهمتك مساعدة الطالب على تنظيم وقته، وتحليل نقاط القوة والضعف في أدائه الدراسي، واقتراح مصادر للمذاكرة.`;
      break;
    case UserRole.PARENT:
      systemInstruction = `أنت "مستشار ولي الأمر التربوي". مهمتك طمأنة ولي الأمر، شرح أداء ابنه بأسلوب مبسط، واقتراح طرق عملية للمساعدة في البيت دون ضغط.`;
      break;
    case UserRole.SUPER_ADMIN:
      systemInstruction = `أنت "المحلل الاستراتيجي للنظام". لديك نظرة شمولية على كافة الفروع. ركز على النمو العام، الأرباح، وجودة الخدمة التقنية.`;
      break;
    default:
      systemInstruction = "أنت مساعد ذكي في نظام العقرب التعليمي.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
      config: {
        systemInstruction: systemInstruction + " استخدم لغة عربية احترافية ومباشرة.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "عذراً، المحلل الذكي يحتاج لحظة لإعادة معالجة البيانات.";
  }
};

/**
 * تقييم الإجابات المقالية القصيرة ذكياً
 */
export const evaluateEssayAnswer = async (question: string, studentAnswer: string, points: number) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      pointsAwarded: { type: Type.NUMBER },
      feedback: { type: Type.STRING, description: "شرح بسيط لماذا الإجابة صحيحة أو خاطئة من الناحية العلمية" }
    },
    required: ["isCorrect", "pointsAwarded", "feedback"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `السؤال التعليمي: ${question}\nإجابة الطالب المكتوبة: ${studentAnswer}\nالدرجة القصوى للسؤال: ${points}`,
      config: {
        systemInstruction: "أنت مصحح تعليمي خبير في نظام العقرب. وظيفتك تقييم مدى صحة الإجابة المقالية القصيرة للطالب. كن مرناً مع الأخطاء الإملائية البسيطة إذا كان المعنى العلمي صحيحاً. أرجع النتيجة بتنسيق JSON حصراً.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Essay Evaluation Error:", error);
    return { isCorrect: false, pointsAwarded: 0, feedback: "فشل الاتصال بمحرك التقييم الذكي حالياً." };
  }
};

/**
 * المصحح الذكي - تحليل ورقة إجابة مصورة
 */
export const analyzeExamPaper = async (imageBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });

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
          },
          required: ["questionNumber", "studentAnswer", "isCorrect", "pointsAwarded"]
        }
      }
    },
    required: ["detectedStudentName", "totalScore", "maxScore", "analysis"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(',')[1]
            }
          },
          { text: "حلل ورقة الإجابة المرفقة. استخرج اسم الطالب، والدرجة النهائية، وقم بتفصيل كل سؤال مع إجابة الطالب وما إذا كانت صحيحة أم لا." }
        ]
      },
      config: {
        systemInstruction: "أنت المصحح الذكي في نظام العقرب. وظيفتك تحليل صور أوراق الإجابات المكتوبة بخط اليد أو المطبوعة بدقة عالية جداً وإرجاع النتائج بتنسيق JSON.",
        responseMimeType: "application/json",
        responseSchema: correctionSchema
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("OCR Correction Error:", error);
    throw error;
  }
};

/**
 * المعلم الذكي المطور - يدعم النصوص والصور
 */
export const getSmartTutorResponse = async (question: string, imageBase64?: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });
  try {
    const parts: any[] = [{ text: question }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: `أنت "المعلم الذكي" في منصة العقرب التعليمية. 
        - إذا أرسل الطالب صورة لمسألة، قم بحلها مع شرح الخطوات بالتفصيل.
        - استخدم لغة عربية ودودة ومشجعة.
        - ركز على تبسيط المفاهيم الفيزيائية والعلمية.
        - إذا كانت الصورة غير واضحة، اطلب من الطالب إعادة تصويرها بلباقة.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Smart Tutor Error:", error);
    return "عذراً، واجه مشكلة في معالجة طلبك. يرجى المحاولة مرة أخرى.";
  }
};

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
          type: { type: Type.STRING, description: "واحد من: true_false, single_choice, short_essay" },
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
        required: ["type", "text", "points"]
      }
    }
  },
  required: ["title", "description", "questions"]
};

export const generateSmartExam = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `قم بإنشاء اختبار احترافي بناءً على هذا الوصف: ${prompt}`,
      config: {
        systemInstruction: "أنت خبير تربوي في نظام العقرب. قم بتوليد اختبار مهيكل بتنسيق JSON. تأكد أن الأسئلة متنوعة وعلمية دقيقة.",
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA,
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Exam Generation Error:", error);
    throw error;
  }
};

export const generateRemedialQuiz = async (analysisContext: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: `بناءً على هذا التحليل لنقاط ضعف الطالب: "${analysisContext}"
      قم بإنشاء اختبار علاجي قصير (Remedial Quiz) مكون من 3 أسئلة فقط للتركيز على هذه النقاط.`,
      config: {
        systemInstruction: "أنت خبير تربوي في نظام العقرب. وظيفتك إنشاء اختبارات علاجية دقيقة وموجهة.، أرجع النتيجة في JSON بنفس هيكلية الاختبارات.",
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA,
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Remedial Quiz Generation Error:", error);
    throw error; // Let the caller handle it or return a default structure
  }
};
