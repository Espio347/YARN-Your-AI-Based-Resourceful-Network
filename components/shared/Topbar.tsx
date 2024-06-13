import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import Chatbot from '../chatbot/Chatbot';

function Topbar() {
  return (
    <nav className="topbar flex justify-between items-center">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
            <Image src="/assets/logo.svg" alt="logo" width={28} height={28}/>
            <p className="text-heading3-bold text-light-1 max-xs:hidden">YARN</p>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">

        {/* Other elements on the right */}
        <div className="flex">
        <div className="block md:hidden px-4">
              <div className="flex cursor-pointer">
                <Link href="/chatbotmobile">
                <Image src="/assets/chat.svg" alt="logout" width={24} height={24} />
                </Link>
              </div>
        </div>

        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        </div>
        {/* Organization Switcher */}
        <OrganizationSwitcher 
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
