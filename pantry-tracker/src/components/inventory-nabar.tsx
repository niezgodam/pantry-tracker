import Link from "next/link";
import { Inter } from 'next/font/google'
import '@/layouts/navbar.css'
import { usePathname } from 'next/navigation'
import { useEffect } from "react";
import { useContext } from '@/context/context';

const inter = Inter({ 
    weight: '600',
    subsets: ['latin'] 
})

export default function InventoryNavbar(){


    const pathname = usePathname()

    const { currentInventoryPage, setCurrentInventoryPage } = useContext();
    const { searchPhrase, setSearchPhrase } = useContext();

    const handleNavbar = (page : string) => {
        setSearchPhrase('');
        setCurrentInventoryPage(page)
    }

    return(
        <nav className="h-[50px] w-full overflow-hidden flex justify-between items-center py-8">
            <div className=" justify-center items-center">
                <h1 className={`${inter.className} sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-sm ml-4 uppercase text-[#fad882] text-shadow-navbar`}>
                    <Link className="" href="/">Home</Link>
                </h1>
            </div>
            <div className="mr-4 text-2xl flex">
                <div className={`${inter.className} sm:text-sm lg:text-xl 2xl:text-2xl text-sm px-4 border-anim ${currentInventoryPage === 'addItem' && " text-stone-300 duration-300 ease-in-out"}`}>
                    <h1 className="cursor-pointer uppercase" onClick={() => handleNavbar('addItem')}>Add item</h1>
                </div>
                <div className={`${inter.className} sm:text-sm lg:text-xl text-sm 2xl:text-2xl px-4 text-center border-anim ${currentInventoryPage === 'inventory' && "text-stone-300 duration-300 ease-in-out"}`}>
                    <h1 className="cursor-pointer uppercase" onClick={() => handleNavbar('inventory')}>Inventory</h1>
                </div>
                <div className={`${inter.className} sm:text-sm lg:text-xl 2xl:text-2xl text-sm px-4 border-anim ${currentInventoryPage === 'category' && "text-stone-300 duration-300 ease-in-out"}`}>
                    <h1 className="cursor-pointer uppercase" onClick={() => handleNavbar('category')}>Category</h1>
                </div>
            </div>
        </nav>
    );
}