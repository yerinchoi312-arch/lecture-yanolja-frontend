import { twMerge } from "tailwind-merge";

function Footer() {
    return<div className={twMerge(["mt-auto"],["bg-blue-50"])}>footer</div>
}
export default Footer;