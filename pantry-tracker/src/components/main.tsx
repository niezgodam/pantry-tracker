'use client'
import '@/layouts/grocerries.css';
import ShoppingCart from "./shopping-cart";
import '@/layouts/main.css';
import Navbar from "./navbar";
import { Inter } from 'next/font/google'
import { TypeAnimation } from 'react-type-animation';
import Image from "next/image";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import storage from '@/assets/container-rdy.png';
import basket from '@/assets/basket-rdy.png';
import container from '@/assets/container.png';




const inter = Inter({ 
    weight: '600',
    subsets: ['latin'] 
})

const inter_thin = Inter({ 
    weight: '200',
    subsets: ['latin'] 
})

export default function Main() {

    const circles = Array(36).fill(null);


    useGSAP(() => {

        const tl = gsap.timeline({
            delay: 0.01,
            yoyo: true,
        })

        tl.from('.frame-1',{
            y:100,
            duration: 0.5,
            ease: "power4.out",
            yoyo: true,
        })
        .from('.frame-2',{
            y:100,
            duration: 0.75,
            ease: "power4.out",
            yoyo: true,
        })
        .from('.frame-3',{
            y:100,
            duration: 1,
            ease: "power4.out",
            yoyo: true,
        })
    })

    return (
        <div className="w-[80%] h-[60%] bg-white absolute top-[50%] -translate-y-1/2 left-[50%] transform -translate-x-1/2 rounded-2xl drop-shadow-2xl shadow-black">
            <div className="grid grid-rows-6 grid-cols-6 absolute -top-[150px] -left-[150px] w-[200px] h-[200px] -z-10">
                {circles.map((_, index) => (
                    <div key={index} className="circle bg-[#2f4975] w-[150px] h-[150px]"></div>
                ))}
            </div>
            <div className="grid grid-rows-6 grid-cols-6 absolute -bottom-[60px] right-[70px] w-[200px] h-[200px] -z-10">
                {circles.map((_, index) => (
                    <div key={index} className="circle bg-[#f7c102] w-[150px] h-[150px]"></div>
                ))}
            </div>
            <div className='absolute -bottom-[10%] sm:-bottom-[15%] left-[5%] flex'>
                <div className='border-[2px] border-[#f7c102] rounded-3xl w-[18%] sm:w-[20%] md:w-[18%] lg:w-[14%] xl:w-[15%] 2xl:w-[12%] mx-[20px] overflow-hidden frame-1'>
                    <Image className='object-cover w-full h-full rounded-3xl' src={storage} alt="storage" />
                </div>
                <div className='border-[2px] border-[#f7c102] rounded-3xl w-[18%] sm:w-[20%] md:w-[18%] lg:w-[14%] xl:w-[15%] 2xl:w-[12%] mx-[20px] overflow-hidden frame-2'>
                    <Image className='object-cover w-full h-full rounded-3xl' src={basket} alt="basket" />
                </div>
                <div className='border-[2px] border-[#f7c102] rounded-3xl w-[18%] sm:w-[20%] md:w-[18%] lg:w-[14%] xl:w-[15%] 2xl:w-[12%] mx-[20px] overflow-hidden frame-3'>
                    <Image className='object-cover w-full h-full rounded-3xl' src={container} alt="container" />
                </div>
            </div>
            <div className="rounded-2xl w-full h-full z-20 bg-white px-4 flex flex-col">
                <Navbar />
                <div className="w-full flex-1 grid grid-cols-3 rounded-2xl overflow-hidden">
                    <div className="col-span-2 flex justify-center items-center">
                        <div className="w-[70%] h-[70%]">
                            <h1 className={`${inter.className} sm:text-3xl md:text-3xl lg:text-4xl text-[#787a7d] text-2xl mb-4`}>From Chaos to Clarity</h1>
                            <h1 className={`${inter_thin.className} sm:text-2xl md:text-2xl lg:text-3xl text-black text-2xl font-extralight mb-4`}>Streamline Your Pantry and Save Time on Meal Planning</h1>
                            <h1>
                            <TypeAnimation
                                sequence={[
                                    
                                    'Smart Pantry Management: Track',
                                    1000, 
                                    'Smart Pantry Management: Plan',
                                    1000,
                                    'Smart Pantry Management: Simplify',
                                    1000,
                                ]}
                                className='text-[#2f4975] sm:text-xl md:text-2xl lg:text-3xl text-2xl'
                                wrapper="span"
                                speed={50}
                                style={{ display: 'inline-block' }}
                                repeat={Infinity}
                                />
                            </h1>
                        </div>
                    </div>
                    <div className="col-start-3 flex items-center justify-center">
                        <div className="w-full h-[100%] relative scale-[150%]">
                            <ShoppingCart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


