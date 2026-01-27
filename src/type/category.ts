export interface SubCategory {
    id: number;
    name: string;
    categoryId: number;
}

export interface Category {
    id: number;
    name: string;
    path: string;
    image: string;
    subCategories: SubCategory[];
}
