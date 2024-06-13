import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import '../globals.css';

export const metadata = {
    title: 'YARN',
    description: 'Your AI Based Resourceful Network'
}

const inter = Inter({subsets: ["latin"]})

export default function RootLayout({ children }:{children: React.ReactNode}) 
{
    return (
        <ClerkProvider>
            <html lang="en">
                 <section className= {`${inter.className} bg-dark-1`}>
                    <div className="w-full justify-center items-center min-h-screen">
                    {children}
                    </div>
                 </section>
            </html>
        </ClerkProvider>
    )
}