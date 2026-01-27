//카테고리 메뉴 조회
export interface CategoryResponse {
    message : string;
    data:CategoryData[]
}
export interface SubCategoryData {
    id: number;
    name: string;
    categoryId: number;
}
export interface CategoryData {
    id: number;
    name: string;
    path: string;
    image: string;
    subCategories:SubCategoryData[];
}
//2차 카테고리 상세 조회 (상품 포함)
export interface SubCategoryResponseData{
    id: number;
    name: string;
    categoryId: number;
    category:{
        id: number;
        name: string;
        path: string;
    }
}
export interface SubCategoryResponseProduct {
    id: number;
    name: string;
    createdAt: string;
}
export interface SubCategoryResponse {
    message : string;
    data:SubCategoryResponseData[];
    product:SubCategoryResponseProduct[];
}
