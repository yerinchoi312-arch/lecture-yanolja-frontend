export interface Review {
    id: number;
    content: string;
    rating: number;
    images: string[];
    userId: number;
    username?: string;
    createdAt: string;
}
