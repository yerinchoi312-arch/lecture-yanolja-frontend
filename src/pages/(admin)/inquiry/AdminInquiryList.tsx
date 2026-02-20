import { useEffect, useState } from "react";
import type { Inquiry } from "../../../type/inquiry.ts";
import { adminDeleteInquiry, adminInquiriesList } from "../../../api/inquiry.api.ts";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

function AdminInquiryList() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    useEffect(() => {
        const fetchList = async () => {
            const data = await adminInquiriesList();
            setInquiries(data.data);
        };
        fetchList();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        await adminDeleteInquiry(id); // 삭제 API
        setInquiries(prev => prev.filter(item => String(item.id) !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">고객 문의 관리 (ADMIN)</h1>
            <div className="bg-white rounded-lg shadow">
                {inquiries.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border-b">
                        <Link to={`/admin/inquiries/${item.id}`} className="flex-1">
                            <span className="text-blue-500 mr-2">[{item.type}]</span>
                            <span className="font-medium">{item.title}</span>
                        </Link>
                        <div className="flex gap-2">
                            <InquiryStatusBadge status={item.status} />
                            <button onClick={() => handleDelete(String(item.id))} className="text-red-500 text-sm">삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default AdminInquiryList
interface Props {
    status: "PENDING" | "ANSWERED";
}

const InquiryStatusBadge = ({ status }: Props) => {
    const statusConfig = {
        PENDING: {
            label: "답변 대기",
            className: "bg-gray-200 text-gray-500",
        },
        ANSWERED: {
            label: "답변 완료",
            className: "bg-black text-white",
        },
    };

    const { label, className } = statusConfig[status];

    return (
        <span className={twMerge(
            "px-2 py-1 text-[10px] font-bold rounded-sm whitespace-nowrap",
            className
        )}>
      {label}
    </span>
    );
};