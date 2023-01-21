export enum UserRole {
    Administrator = "admin",
    User = "user",
}

export enum QuestionType {
    MCQ = "mcq",
    WriteAnswer = "write-answer",
    TrueFalse = "true-false",
}

export enum QuestionDifficulty {
    Hard = "hard",
    Medium = "medium",
    Easy = "easy",
}

export enum TestStatus {
    Draft = "draft",
    Active = "active",
    OnProgress = "on-progress",
    Submitted = "submitted",
    Cancelled = "cancelled",
}
