"use client"
import { SignOutButton, SignedIn , useAuth} from "@clerk/nextjs";
import { sidebarLinks } from '@/constants'
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";

function LeftSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();
    const userId = auth?.userId;
    return (
     <section className="custom-scrollbar leftsidebar">
       <div className="flex w-full flex-1 flex-col gap-6 px-6">
         {sidebarLinks.map((link) => {
         const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

         let href = link.route;
         if (link.route === '/profile' && typeof userId === 'string') {
          href = `${link.route}/${userId}`;
          }
        
        

         return (
          <Link href={href}
          key={link.label}
          className={`leftsidebar_link ${
            isActive && 'bg-primary-500'}`}
          >
          <Image
          src={link.imgURL}
          alt={link.label}
          width={24}
          height={24}
          />
          
          <p className='text-light-1 max-lg:hidden'>{link.label}</p>

          </Link>
         )})}
       </div>
       <div className='mt-10 px-6'>
       <SignedIn>
            <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex w-full flex-col gap-3 px-4">
                <div className="flex cursor-pointer gap-4 padding-4">
                    <Image src="/assets/logout.svg" alt="logout" width={20} height={20} />
                    <p className="text-light-2 max-lg:hidden">Logout</p>
                </div>
            </div>
            </SignOutButton>
           </SignedIn>
       </div>
     </section>
    )
}

export default LeftSidebar;