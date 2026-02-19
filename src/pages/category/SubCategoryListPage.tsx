import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { CategoryData } from "../../type/category.ts";
import type { ProductListParams, ProductSummary } from "../../type/product.ts";
import { getCategories } from "../../api/category.api.ts";
import { fetchProducts } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";
import TopButton from "../components/TopButton.tsx";
import Button from "../components/Button.tsx";

function SubCategoryListPage() {
    const navigate = useNavigate();
    const { id, subId } = useParams(); //< category id
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductSummary[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getCategories();
                const data = response.data.find(item => item.id === Number(id));
                if (data) {
                    setCategory(data);
                }
            } catch (e) {
                console.log("데이터 로딩 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory().then(() => {});
    }, [id]);

    useEffect(() => {
        const fetchProduct = async () => {
            const parentId = id || category?.id;
            if (!parentId) return;
            setLoading(true);
            try {
                const params: ProductListParams = {
                    page: 1,
                    limit: 100,
                    categoryId: Number(parentId),
                    subCategoryId: subId ? Number(subId) : undefined,
                };
                const response = await fetchProducts(params);
                setProducts(response.data.sort(()=>Math.random() - 0.5));
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct().then(() => {});
    }, [id, subId, category, navigate]);

    if (!products) return null;
    if (!category) return null;

    return (
        <div
            className={twMerge(
                ["space-y-30", "py-10"],
                ["max-w-[800px]", "min-h-screen", "mx-auto"],
            )}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "justify-between", "items-center", "gap-10", "p-10"],
                    ["rounded-2xl", "h-full"],
                )}>
                <div className={"w-full flex flex-col"}>
                    <h2 className={"font-bold text-2xl"}>
                        {subId
                            ? category.subCategories.find(sub => sub.id === Number(subId))?.name
                            : category.name}{" "}
                        {category.name} 리스트
                    </h2>
                    <div className={"font-bold text-lg mt-2"}>
                        총 <span className={"text-blue-500"}>{products.length}</span>개
                    </div>
                </div>
                <div className=" w-full rounded-xl min-h-[200px]">
                    {loading ? (
                        <div className="text-center py-10">데이터 로딩 중...</div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {products.map(product => (
                                <Link
                                    to={`/products/${product.id}`}
                                    key={product.id}
                                    className={twMerge(
                                        ["flex", "flex-col"],
                                        ["bg-white", "p-4", "border", "border-gray-200"],
                                    )}>
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className={"aspect-video rounded-xl mb-2"}
                                    />
                                    <h2 className={"text-lg font-semibold"}>{product.name}</h2>
                                    <p className={"text-sm"}>
                                        {product.address.split(" ").slice(0, 2).join(" ")}
                                    </p>
                                    <p className={"text-right w-full font-bold"}>
                                        {product.minPrice.toLocaleString()}원 ~
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            "{category.subCategories.find(s => s.id === Number(subId))?.name}"
                            지역에 등록된 숙소가 없습니다.
                        </div>
                    )}
                </div>
                <Button fullWidth={true} variant={"secondary"} onClick={() => navigate(-1)}>
                    목록으로
                </Button>
            </div>
            <TopButton />
        </div>
    );
}
export default SubCategoryListPage;
