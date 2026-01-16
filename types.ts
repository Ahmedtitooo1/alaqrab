
export enum UserRole {
  GUEST = 'guest',
  SUPER_ADMIN = 'super_admin',
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  ACCOUNTANT = 'accountant',
  PARENT = 'parent',
  ANNOUNCER = 'announcer'
}

export enum ClientType {
  INSTITUTION = 'institution',
  INDIVIDUAL = 'individual',
  SCHOOL = 'school'
}

export enum PricingModel {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  PER_STUDENT = 'per_student'
}

export enum AnnouncementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum AnnouncementType {
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event'
}

export enum QuestionType {
  TRUE_FALSE = 'true_false',
  SINGLE_CHOICE = 'single_choice',
  SHORT_ESSAY = 'short_essay',
  IMAGE_CHOICE = 'image_choice',
  HOTSPOT = 'hotspot'
}

export interface User {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  username?: string;
  role: UserRole;
  institutionId: string;
  teacherId?: string;
  teacherIds?: string[];
  parentId?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  aiQuestionsCount: number;
  salary?: number;
  allowances?: number;
  deductions?: number;
  jobTitle?: string;
  balance?: number;
  subscriptionAmount?: number;
  nextRenewalDate?: string;
  maxStudents?: number; // Added for teacher capacity
  teacherCapacity?: number;
  avatar?: string;
  iban?: string;
  bankName?: string;
}

export interface PaymentLog {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface Institution {
  id: string;
  name: string;
  type: ClientType;
  subdomain: string;
  logo?: string;
  permissions: {
    allowCustomBranding: boolean;
    allowAiCorrection: boolean;
    allowSmartAnalyst: boolean;
    allowAiUsage: boolean;
    allowFinancialLedger: boolean;
    allowLiveStreaming: boolean;
  };
  limits: {
    admins: number;
    teachers: number;
    accountants: number;
    students: number;
  };
  pricing: {
    model: PricingModel;
    totalAmount: number;
    paidAmount: number;
  };
  paymentHistory: PaymentLog[];
  expiryDate: string;
  status: string;
  revenue: number;
}

export interface FinancialCategory {
  id: string;
  name: string;
  code: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentId?: string;
  level: number;
  isDynamic?: boolean;
}

export interface VoucherLine {
  id: string;
  description: string;
  amount: number;
  accountId: string;
}

export interface FinancialEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  debitAccount: string;
  creditAccount: string;
  currency?: string;      // Added for multi-currency
  exchangeRate?: number;  // Added for multi-currency
  refType?: 'payroll' | 'inventory' | 'subscription' | 'manual' | 'transfer';
  attachment?: string;
  lines?: VoucherLine[];
  isPosted?: boolean;
  isCanceled?: boolean;
}

export interface FinancialFund {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet';
  balance: number;
  accountCode: string;
  // بيانات الدفع الإلكتروني
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  walletNumber?: string;
  walletProvider?: 'vodafone-cash' | 'orange-cash' | 'etisalat-cash' | 'instapay' | 'other';
  qrCode?: string;
  isActiveForParentPayments?: boolean;
  fundImage?: string; // URL or Base64 of the fund image (QR, Screenshot, etc.)
  bankAccountNum?: string;
}

export interface Liability {
  id: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  minQuantity: number;
  location: string;
  accountCode?: string;
  supplierId?: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  description: string;
  supplierId?: string;
  refNo?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  month: number;
  year: number;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  correctAnswer: string;
  options?: { id: string; text: string }[];
  image?: string;
  correctPoint?: { x: number; y: number };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  date: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  mediaUrl?: string;
  mediaType?: string;
  eventDate?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalPoints: number;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
  security: {
    preventCheating: boolean;
    showInstantResults: boolean;
    allowReview: boolean;
    timerVisible: boolean;
  }
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  subject: string;
  teacherId: string;
  status: 'active' | 'closed';
  attachmentUrl?: string;
  questions?: Question[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  status: 'pending' | 'graded' | 'returned';
  comment?: string;
  score?: number;
  files: { url: string; type: 'image' | 'pdf' }[];
}

export interface StudentProgress {
  userId: string;
  subject: string;
  monthlyScores: { month: string; score: number }[];
  attendanceRate: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  institutionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface ClassSchedule {
  id: string;
  subject: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  type: 'course' | 'exam' | 'summary' | 'video';
  price: number;
  teacherId: string;
  teacherName: string;
  description: string;
  thumbnail?: string;
  contentUrl?: string;
  status: 'pending' | 'active' | 'archived';
  salesCount: number;
  commission: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  type: 'streak' | 'exam_score' | 'attendance' | 'special';
}

export interface LearningPath {
  id: string;
  title: string;
  studentId: string;
  steps: {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'file';
    targetId: string;
    isCompleted: boolean;
    unlockCondition?: {
      minScore?: number;
      previousStepId?: string;
    }
  }[];
  progress: number;
}

export interface ProctoringLog {
  id: string;
  examId: string;
  studentId: string;
  timestamp: string;
  event: 'tab_switch' | 'minimized' | 'external_click';
  duration?: number;
}