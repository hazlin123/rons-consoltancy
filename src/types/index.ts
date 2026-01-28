export type ScholarshipCategory = 'Undergraduate' | 'Masters' | 'PhD' | 'Vocational';

export interface Scholarship {
    id: string;
    title: string;
    university: string;
    country: string;
    countryCode?: string; // ISO code for flags (e.g. GB, US)
    flagUrl?: string; // e.g. "gb", "us"
    deadline: string; // ISO Date
    amount: string; // e.g. "Full Tuition + Stipend"
    category: ScholarshipCategory;
    description: string;
    requirements: string[];
    slots: number;
    featured?: boolean;
}

export interface Application {
    id: string;
    scholarshipId: string;
    applicantName: string;
    email: string;
    status: 'Pending' | 'Reviewing' | 'Accepted' | 'Rejected';
    submittedAt: string;
}

export interface User {
    id: string;
    studentId?: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    avatar?: string;
}

export interface Payment {
    id: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    purpose: string;
}

export interface Attendance {
    date: string;
    status: 'Present' | 'Absent' | 'Late';
}

export interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    status: 'Completed' | 'Pending' | 'Late';
}

export interface PracticeTest {
    id: string;
    type: 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Full Mock';
    score: number;
    maxScore: number;
    date: string;
}

export interface StudentJourney {
    userId: string;
    tuitionStatus: 'Paid' | 'Partial' | 'Unpaid';
    payments: Payment[];
    attendance: Attendance[];
    assignments: Assignment[];
    practiceTests: PracticeTest[];
    examReadiness: number; // 0-100 percentage
    targetExamDate?: string;
}
