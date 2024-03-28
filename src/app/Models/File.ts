export interface fileData {
    Id: number;
    advertId: number;
    created_at: string;
    DocTypeName: string;
    file: File;
    isdeleted: boolean;
}

export interface fileDataFeedback {
    Id: number;
    feedbackMessageId: number;
    created_at: string;
    DocTypeName: string;
    file: File;
    isdeleted: boolean;
}