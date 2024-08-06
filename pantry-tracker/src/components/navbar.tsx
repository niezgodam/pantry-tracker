import Link from "next/link";
import { Inter } from 'next/font/google'
import '@/layouts/navbar.css'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";

const inter = Inter({ 
    weight: '600',
    subsets: ['latin'] 
})

export default function Navbar(){


    const pathname = usePathname()
    const [isSide,setIsSide] = useState(false);

    return(
        <nav className="h-[50px] w-full overflow-hidden flex justify-between items-center py-4">
            {isSide ? 
                <div className="absolute rounded-2xl bg-black/80 top-0 left-0 w-full h-full z-20 sm:hidden">
                    <div className="w-[90%] mt-[2%] mx-auto block justify-between items-center h-full">
                        <h1 className={`${inter.className} sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-sm ml-4 uppercase`}>
                            <Link className="" href="/"><CiMenuBurger fill="white" size={25} onClick={() => setIsSide(false)}/></Link>
                        </h1>
                        <div className="w-full flex justify-center items-center min-h-full flex-1">
                            <div className="mr-4 text-2xl uppercase justify-center items-center">
                                <div className={`${inter.className} py-4 text-2xl px-4 text-white text-center`}>
                                    <Link className="" href="/">Home</Link>
                                </div>
                                <div className={`${inter.className} py-4 text-2xl px-4 text-center text-white`}>
                                    <Link href="/pantry-inventory">Pantry inventory</Link>
                                </div>
                                <div className={`${inter.className} text-2xl py-4 px-4 text-white text-center`}>
                                    <Link href="/contact">Contact</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   
                :
                <div className=" justify-center items-center sm:hidden">
                    <h1 className={`${inter.className} sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-sm ml-4 uppercase`}>
                        <Link className="" href="/"><CiMenuBurger size={25} onClick={() => setIsSide(true)}/></Link>
                    </h1>
                </div>
            }
            <div className=" justify-center items-center hidden sm:flex">
                <h1 className={`${inter.className} sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-sm ml-4 uppercase text-[#fad882] text-shadow-navbar`}>
                    <Link className="" href="/">Pantry Tracker</Link>
                </h1>
            </div>
            <div className="mr-4 text-2xl uppercase justify-center items-center hidden sm:flex">
                <div className={`${inter.className} sm:text-sm lg:text-xl 2xl:text-2xl text-sm px-4 border-anim`}>
                    <Link className="" href="/">Home</Link>
                </div>
                <div className={`${inter.className} sm:text-sm lg:text-xl text-sm 2xl:text-2xl px-4 text-center hidden sm:flex border-anim`}>
                    <Link href="/pantry-inventory">Pantry inventory</Link>
                </div>
                <div className={`${inter.className} sm:text-sm lg:text-xl 2xl:text-2xl text-sm px-4 hidden sm:flex border-anim`}>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    );
}