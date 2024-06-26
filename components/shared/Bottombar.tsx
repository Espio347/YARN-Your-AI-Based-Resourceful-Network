"use client";
import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Bottombar() {
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();
    const userId = auth?.userId;

    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    let href = link.route;
                    if (link.route === '/profile' && typeof userId === 'string') {
                        href = `${link.route}/${userId}`;
                    }

                    return (
                        <Link href={href} key={link.label} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(/\s+/)[0]}</p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default Bottombar;
