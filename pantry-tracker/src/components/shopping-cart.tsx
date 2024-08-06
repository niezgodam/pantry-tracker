'use client'

import Image from "next/image";
import shoppingCartImage from '@/assets/shopping-cart.png';
import apple from '@/assets/apple-to-cart.png';
import banana from '@/assets/banana.png';
import bread from '@/assets/bread.png'; 
import lettuce from '@/assets/lettuce.png'; 
import milk from '@/assets/milk.png';
import paprica from '@/assets/paprica.png'; 
import cheese from '@/assets/cheese.png';
import tomato from '@/assets/tomato.png';
import onion from '@/assets/onion.png';
import cereal from '@/assets/cereal.png';

import '@/layouts/grocerries.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '@/layouts/grocerries.css';

export default function ShoppingCart() {
    useGSAP(() => {
        gsap.from('.apple', { y: -300, rotate: 720, duration: 3 });
        gsap.from('.lettuce', { y: -350, rotate: 720, duration: 4 });
        gsap.from('.banana', { y: -350, rotate: 1440, duration: 3 });
        gsap.from('.milk', { y: -250, rotateX: 720, duration: 2 });
        gsap.from('.paprica', { y: -250, rotate: 720, duration: 3 });
        gsap.from('.bread', { y: -250, rotateY: 720, duration: 2 });
        gsap.from('.cheese', { y: -400, rotate: 720, duration: 3 });
        gsap.from('.tomato', { y: -400, rotate: 3600, duration: 3 });
        gsap.from('.onion', { y: -300, rotate: 1800, duration: 3 });
        gsap.from('.cereal', { y: -300, rotate: 1800, duration: 3 });
        gsap.from('.shopping-cart', { x: 300, duration: 3 });
    });

    return (
        <div className="relative w-full h-full grid place-items-center">
            <div className="relative">
                <Image className="absolute top-[30%] left-[30%] bread w-[25%]" src={bread} alt="bread" />
                <Image className="absolute top-[32%] left-[42%] banana w-[25%]" src={banana} alt="banana" />
                <Image className="absolute top-[24%] left-[18%] lettuce w-[25%]" src={lettuce} alt="lettuce" />
                <Image className="absolute top-[29%] left-[53%] milk w-[18%]" src={milk} alt="milk" />
                <Image className="absolute top-[20%] left-[32%] paprica w-[22%]" src={paprica} alt="paprica" />
                <Image className="absolute top-[34%] left-[16%] apple w-[25%]" src={apple} alt="apple" />
                <Image className="absolute left-[32%] top-[19%] cheese w-[30%]" src={cheese} alt="cheese" />
                <Image className="absolute left-[40%] top-[23%] tomato w-[20%]" src={tomato} alt="tomato" />
                <Image className="absolute left-[46%] top-[38%] onion w-[20%]" src={onion} alt="onion" />
                <Image className="absolute left-[46%] top-[13%] cereal w-[25%]" src={cereal} alt="cereal" />
                <Image className="shopping-cart" src={shoppingCartImage} alt="shopping cart" />
            </div>
        </div>
    );
}
