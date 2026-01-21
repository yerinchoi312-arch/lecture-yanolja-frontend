import footerLogo from "../assets/images/common/footer_logo.svg"
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { FaBloggerB, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
    return (
        <div className={twMerge(["mt-auto","py-5"], ["bg-gray-100"])}>
            <div className={twMerge(["max-w-[1280px]", "mx-auto"],["flex","flex-col","gap-4"])}>
                <img src={footerLogo} alt={"nol"} className={"w-16 h-8"}/>
                <div className={twMerge(["flex","gap-2","text-sm","text-gray-800","font-semibold"])}>
                    <Link to={"/"} className={"border-r pr-2 border-gray-400"}>회사소개</Link>
                    <Link to={"/"} className={"border-r pr-2 border-gray-400"}>이용약관</Link>
                    <Link to={"/"}>개인정보 처리방침</Link>
                </div>
                <div className={twMerge(["flex","gap-4"])}>
                    <Link to={"/"}><FaInstagram className={"w-6 h-6"}/></Link>
                    <Link to={"/"}><FaYoutube className={"w-6 h-6"} /></Link>
                    <Link to={"/"}><FaFacebook className={"w-6 h-6"} /></Link>
                    <Link to={"/"}><FaBloggerB className={"w-6 h-6"} /></Link>
                </div>
                <p className={"text-xs text-gray-600"}>Copyright, All rights reserved</p>
            </div>
        </div>
    );
}
export default Footer;
