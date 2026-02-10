import { twMerge } from "tailwind-merge";
import BackButton from "../components/BackButton.tsx";
import Button from "../components/Button.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination.tsx";
import { FetchMyInquiries } from "../../api/inquiry.api.ts";
import type { Inquiry } from "../../type/inquiry.ts";

function InquiryList() {
    const { isLoggedIn } = useAuthStore();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const[loading, setLoading] = useState(false);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const LIMIT=10;

    useEffect(() => {
        const loadInquiries = async (page:number) => {
            setLoading(true);
            try{
                const response = await FetchMyInquiries(page,LIMIT)
                setInquiries(response.data)      ;
                setTotalPages(response.pagination.totalPages);
            }catch (e) {
                console.error(e);
            }finally {
                setLoading(false);
            }
        }
        loadInquiries(currentPage).then(()=>{})
    }, [currentPage]);

    const onPageChange = (page:number) =>{
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }
    if(loading) return <div>loading,,,</div>
    return (
        <div className={"bg-gray-50"}>
            <div
                className={twMerge(
                    ["flex", "flex-col", "py-10","gap-10"],
                    ["max-w-[800px]", "mx-auto", "w-full", "h-full", "min-h-[calc(100dvh-280px)]"],
                )}>
                <div className={"relative"}>
                    <BackButton className={"absolute top-2 md:hidden"} />
                    <h2 className={twMerge(["text-2xl", "font-bold", "mb-8", "text-left"])}>
                        내 문의 목록
                    </h2>
                    {isLoggedIn && (
                        <div className={"flex justify-end"}>
                            <Button size={"sm"} onClick={() => navigate("write")}>
                                글쓰기
                            </Button>
                        </div>
                    )}
                </div>
                <div className={"bg-white"}>
                    {inquiries.map(inquiry=>(
                        <Link to={`/inquiry/${inquiry.id}`} key={inquiry.id}>
                            {inquiry.title}
                        </Link>
                    ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>
            </div>
        </div>
    );
}
export default InquiryList;
