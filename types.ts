
export enum UserRole {
  GUEST = 'guest',
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  ACCOUNTANT = 'accountant',
  PARENT = 'parent',
  ANNOUNCER = 'announcer',
  SECRETARY = 'secretary'
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

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBase: boolean;
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
  parentId?: string;
  email?: string;
  phone?: string;
  aiQuestionsCount: number;
  salary?: number;
  allowances?: number;
  deductions?: number;
  jobTitle?: string;
  balance?: number;
  subscriptionAmount?: number;
  paidAmount?: number;
  nextRenewalDate?: string;
  // Academic Structure Extras
  academicYearId?: string;
  gradeLevelId?: string;
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
  type: ClientType; // 'institution' | 'individual' | 'school'
  subdomain: string;
  logo?: string;

  // -- NEW GOVERNANCE LAYER (SaaS) --
  features: {
    hasAccounting: boolean;
    hasBranding: boolean;
    hasSecretary: boolean;
    hasAI: boolean;
    hasApiAccess: boolean;

    // Backward compatibility mappings (Deprecated)
    allowCustomBranding?: boolean;
    allowAiCorrection?: boolean;
    allowSmartAnalyst?: boolean;
    allowAiUsage?: boolean;
    allowFinancialLedger?: boolean;
    allowLiveStreaming?: boolean;
  };

  quotas: {
    maxStudents: number;
    maxTeachers: number;
    maxStorageGB: number;
    // Backward compatibility
    admins?: number;
    teachers?: number;
    accountants?: number;
    students?: number;
  };

  subscription: {
    plan: 'GOLD' | 'SILVER' | 'FREE';
    status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
    startDate: string;
    endDate: string;
    // Backward compatibility
    model?: PricingModel;
    totalAmount?: number;
    paidAmount?: number;
    revenue?: number;
  };

  settings: {
    apiKey?: string;
  };

  // -- Legacy Props (Deprecated but kept for stability) --
  permissions?: any; // To allow legacy checks if any
  limits?: any;
  pricing?: any;

  paymentHistory: PaymentLog[];
  expiryDate: string;
  status: string;
  revenue: number;
  defaultCurrency?: string;
  currencies?: Currency[];
}

export interface FinancialCategory {
  id: string;
  name: string;
  code: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentId?: string;
  level: number;
  isDynamic?: boolean;
  institutionId: string;
}

export interface VoucherLine {
  id: string;
  description: string;
  amount: number;
  publicAccountNumber?: string;
  isPublicToGuardians?: boolean;
  accountDescription?: string;
  accountId: string;
  // Added for entity linking and improved UI state
  category?: string;
  entityType?: string;
  subTargetId?: string;
  subTargetSearch?: string;
}

export interface FinancialEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  debitAccount: string;
  creditAccount: string;
  institutionId: string;
  refType?: 'payroll' | 'inventory' | 'subscription' | 'manual' | 'transfer' | 'journal' | 'adjustment' | 'expense' | 'payment' | 'invoice';
  attachment?: string;
  lines?: VoucherLine[];
  costCenter?: string;
  currency?: string;
  exchangeRate?: number;
  isPosted?: boolean;
  isCanceled?: boolean;
  targetId?: string; // To link with student/employee/supplier
}

export interface FinancialFund {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'wallet';
  balance: number;
  accountCode: string;
  publicAccountNumber?: string; // Appears to parents for payments
  isPublicToGuardians?: boolean;
  institutionId: string;
  accountDescription?: string;
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
  institutionId: string;
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
  unitPrice?: number;
  institutionId: string;
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
  institutionId: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  institutionId: string;
  userId?: string;
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
  correctX?: number; // Coordinates for Hotspot
  correctY?: number;
  toleranceRadius?: number; // Distance tolerance in pixels (or percentage if preferred)
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
  authorRole: UserRole | string;
  mediaUrl?: string;
  mediaType?: string;
  eventDate?: string;
  institutionId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId?: string;
  subject?: string;
  teacherId?: string;
  status?: string;
  points?: number;
  questions?: Question[];
  studentsSubmitted?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  fileUrl?: string;
  files?: { url: string; type: string }[];
  submittedAt: string;
  submissionDate?: string;
  status?: string;
  grade?: number;
}

export interface LearningPath {
  id: string;
  studentId?: string;
  title: string;
  description: string;
  modules: { id: string; title: string; isCompleted: boolean }[];
  steps?: {
    id: string;
    title: string;
    isCompleted: boolean;
    type?: string;
    targetId?: string;
    unlockCondition?: { previousStepId: string; minScore?: number };
  }[];
  progress: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  author: string;
  rating: number;
  sales: number;
  image?: string;
  category: string;
  teacherName?: string;
  type?: 'course' | 'exam' | 'summary' | 'video';
  thumbnail?: string;
  salesCount?: number;
}

export interface ProctoringLog {
  id: string;
  studentId: string;
  examId: string;
  action: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
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

export interface PaymentRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  amount: number;
  paymentMethod: string;
  fundId: string;
  fundName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  receiptData?: {
    transactionId: string;
    paymentDate: string;
    accountNumber?: string;
    walletNumber?: string;
    screenshot?: string;
  };
  notes?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalPoints: number;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
  institutionId: string;
  teacherId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  type: 'streak' | 'exam_score' | 'attendance' | 'special';
}

// --- 1. Business & Admin Extras ---

export interface CustomFieldDefinition {
  id: string;
  label: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
  targetRole: UserRole;
  institutionId: string;
}

export interface GradingFormula {
  id: string;
  name: string;
  subjectId?: string;
  components: {
    name: string;
    weight: number;
    maxScore: number;
  }[];
  createdAt: string;
  institutionId: string;
}

// --- 2. Operations & Student Extras ---

export interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: 'violation' | 'positive';
  category: 'attendance' | 'conduct' | 'academic' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionTaken?: string;
  reportedBy: string;
  institutionId: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  type?: 'course' | 'achievement' | 'appreciation';
  backgroundImage: string;
  elements?: any[];
  layout?: any;
  createdAt: string;
  institutionId: string;

}

export interface InternalTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'maintenance' | 'it' | 'supplies' | 'other';
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments?: { userId: string; text: string; date: string }[];
  institutionId: string;
}

// --- 3. Accounting Micro-Features ---

export interface FamilyWallet {
  parentId: string;
  balance: number;
  linkedStudentIds: string[];
  institutionId: string;
  transactions: {
    id: string;
    date: string;
    amount: number;
    type: 'deposit' | 'deduction';
    description: string;
    studentId?: string;
  }[];
}

export interface AdjustmentRequest {
  id: string;
  studentId: string;
  amount: number;
  reasonCategory: 'scholarship' | 'sibling_discount' | 'admin_decision' | 'penalty';
  description: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  institutionId: string;
}

// Data Requested by User for UI
export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  receiptUrl?: string; // Optional URL to receipt image
}

export interface ExamResult {
  score: number;
  subject: string;
  feedback?: string;
  badgeType?: 'gold' | 'silver' | 'bronze' | 'none';
}

// --- 4. Academic Structure (Center Mode) ---
export interface AcademicYear {
  id: string;
  name: string; // e.g., "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  institutionId: string;
}

export interface Subject {
  id: string;
  name: string; // e.g., "Physics"
  code?: string;
  gradeLevelId: string; // Linked to a grade level
  assignedTeacherIds?: string[]; // IDs of teachers teaching this subject
}

export interface GradeLevel {
  id: string;
  name: string; // e.g., "Grade 10"
  subjects: Subject[];
  institutionId: string;
}

// --- Timetable ---
export interface TimetableEntry {
  id: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodIndex: number; // 0 for 1st period, etc.
  subjectId: string;
  teacherId: string;
  roomId?: string; // Room ID or name
  gradeLevelId: string;
  institutionId: string;
}

// --- New Finance Module Types ---
export interface FinanceConfig {
  companyName: string;
  taxNumber: string;
  vatRate: number; // e.g., 15
  currency: string;
  isTaxIncluded: boolean;
}

export interface FinanceTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
  studentId?: string; // Optional link to student
  // Tax Fields (Calculated)
  taxAmount: number;
  baseAmount: number;
  status: 'COMPLETED' | 'REFUNDED';
}