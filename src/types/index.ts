export interface DBWriterMessage {
    owner: string;
    repo: string;
    userId: string;
}

export interface RepoVectorMessage {
    owner: string;
    repo: string;
    userId: string;
}

export interface PrReviewMessage {
    owner: string;
    repo: string;
    prNumber: number;
    userId: string;
}

export type KafkaMessage = DBWriterMessage | RepoVectorMessage | PrReviewMessage;

