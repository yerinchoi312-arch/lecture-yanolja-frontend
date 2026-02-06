import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import type { ProductListParams, ProductSummary } from "../../type/product.ts";
import { fetchProducts } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";

    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                const params: ProductListParams = {
                    page: 1,
                    limit: 100,
                    keyword: keyword,
                };
                const response = await fetchProducts(params);
                setProducts(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        getProduct().then(() => {});
    }, [keyword]);

    if (!keyword)
        return <div className={twMerge(["p-10", "text-center"])}>검색어를 입력해주세요.</div>;
    if (loading) return <div className={twMerge(["p-10", "text-center"])}>로딩중...</div>;

    return (
        <div className={twMerge(["space-y-30", "py-10"], ["max-w-[1280px]", "mx-auto", "w-full"])}>
            <div>
                <h2 className={twMerge(["text-2xl", "font-bold", "mb-10", "text-center"])}>
                    '{keyword}' 검색 결과
                </h2>
                {products.length === 0 ? (
                    <div className={"text-left"}>검색 결과가 없습니다.</div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
export default SearchPage;
