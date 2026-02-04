import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { CategoryData } from "../../type/category.ts";
import { getCategories } from "../../api/category.api.ts";
import EventSlide from "../components/EventSlide.tsx";
import Promotion from "../components/PromotionBox.tsx";
import Slide from "../components/Slide.tsx";
import type { ProductListParams, ProductSummary } from "../../type/product.ts";
import { fetchProducts } from "../../api/product.api.ts";
import TopButton from "../components/TopButton.tsx";

function CategoryListPage() {
    const navigate = useNavigate();
    const { id, subId } = useParams(); //< category id
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductSummary[]>([]);


    useEffect(() => {const fetchCategory = async () => {
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
                    limit: 10,
                    categoryId: Number(parentId),
                    subCategoryId: subId ? Number(subId) : undefined,
                };
                const response = await fetchProducts(params);
                setProducts(response.data);
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
        <div className={twMerge(["space-y-30", "py-10"], ["max-w-[1280px]", "mx-auto"])}>
            <div>
                <h2 className={twMerge(["text-3xl", "font-bold", "mb-10", "text-center"])}>
                    {category.name}
                </h2>
                <div
                    className={twMerge(
                        ["flex", "flex-col", "justify-center", "items-center", "gap-10", "p-10"],
                        ["border-2", "border-gray-200"],
                        ["rounded-2xl"],
                    )}>
                    <p className={"text-center font-semibold text-xl"}>어디로 갈까요?</p>
                    <div className={"w-full flex flex-wrap gap-3 justify-center"}>
                        {category?.subCategories?.map(subcategory => (
                            <button
                                type={"button"}
                                key={subcategory.id}
                                onClick={() => navigate(`/categories/${id}/${subcategory.id}`)}
                                className={twMerge(
                                    ["px-4", "py-2", "rounded-2xl"],
                                    ["text-gray-700", "bg-gray-50", "font-medium"],
                                    Number(subId) === subcategory.id && [
                                        "bg-gray-600",
                                        "text-white",
                                    ],
                                )}>
                                {subcategory.name}
                            </button>
                        ))}
                    </div>
                    <div className=" w-full p-8 rounded-xl min-h-[200px]">
                        {loading ? (
                            <div className="text-center py-10">데이터 로딩 중...</div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-4 gap-3">
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
                                            {product.minPrice}원 ~
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
                </div>
            </div>
            <EventSlide slideId={"subEvent"} />
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    인기 {category.name} 미리 예약!
                </h2>
                <Slide
                    categoryId={category.id}
                    slideId={"subSlide"}
                    slidesPerView={4}
                    slidesPerGroup={4}
                />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>
                    같은 지역숙소 여기는 어때요?
                </h2>
                <Slide
                    categoryId={category.id}
                    subCategoryId={
                        category.subCategories.find(subCate=>subCate.id === Number(subId))?.id
                    }
                    slideId={"subSlide"}
                    slidesPerView={4}
                    slidesPerGroup={4}
                />
            </div>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-4"])}>기획전 모음</h2>
                <Promotion />
            </div>
            <TopButton/>
        </div>
    );
}
export default CategoryListPage;
