export interface CreateRoomTypeParams {
    name: string;
    description: string;
    image: string;
    originPrice: number;
    price: number;
}

export interface CreateProductParams {
    categoryId: number;
    subCategoryId: number;
    name: string;
    address: string;
    description: string;
    notice: string;
    images: string[];
    roomTypes: CreateRoomTypeParams[];
}

export interface UpdateProductParams {
    categoryId?: number;
    subCategoryId?: number;
    name?: string;
    address?: string;
    description?: string;
    notice?: string;
    images?: string[];
}

export interface UpdateRoomTypeParams {
    name?: string;
    description?: string;
    image?: string;
    originPrice?: number;
    price?: number;
}
