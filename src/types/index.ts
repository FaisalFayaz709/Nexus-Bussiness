export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isRecurring: boolean;
  createdAt: string;
}

export interface MeetingRequest {
  id: string;
  senderId: string;
  receiverId: string;
  proposedStartTime: string;
  proposedEndTime: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  respondedAt?: string;
}

export interface ConfirmedMeeting {
  id: string;
  participantIds: string[];
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  meetingLink?: string;
  createdAt: string;
}

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'availability';
  data: ConfirmedMeeting | AvailabilitySlot;
};

export interface VideoCallSession {
  id: string;
  initiatorId: string;
  participantId: string;
  startTime: string;
  endTime?: string;
  status: 'incoming' | 'active' | 'completed' | 'declined';
  isRecording: boolean;
  duration?: number;
}

export interface CallParticipant {
  userId: string;
  name: string;
  avatarUrl: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareActive: boolean;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx';
  mimeType: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadDate: string;
  status: 'draft' | 'in_review' | 'signed';
  fileSize: number;
  currentVersion: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'draft' | 'in_review' | 'signed';
}

export interface Signature {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signatureData: string; // Base64 encoded image data
  timestamp: string;
  status: 'pending' | 'signed' | 'declined';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
