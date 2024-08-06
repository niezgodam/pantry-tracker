import Link from "next/link";
import { IoIosSend } from "react-icons/io";


export default function Contact(){


    return (
            <div className="w-[80%] h-[80%] bg-white absolute top-[50%] -translate-y-1/2 left-[50%] transform -translate-x-1/2 rounded-2xl drop-shadow-2xl shadow-black py-[5%] flex justify-center items-center">
                <div className="text-center w-full">
                    <div className="flex justify-start items-center px-[10%]">
                        <h1 className={`sm:text-xl md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-xl ml-4 uppercase hover:scale-110 duration-300 ease-in-out`}>
                            <Link className="" href="/">Home</Link>
                        </h1>
                    </div>
                    <h1 className="text-4xl font-bold">Contact with me 🤝</h1>
                    <div className="my-[1%]">
                        <form action="mailto:officialcontactinfo1@gmail.com" method="GET">
                            <div className="my-[5%] overflow-auto">
                                <input className="border-b-2 border-stone-800 outline-none w-[60%]" type="text" placeholder="Subject" name="subject" required />
                            </div>
                            <div className="overflow-auto my-[5%]">
                                <textarea className="h-[100px] resize-none border-2 rounded-2xl p-1 border-stone-800 outline-none w-[60%]" placeholder="Your message" name="body" required></textarea>
                            </div>
                            <div className="bg-blue-600 w-[80%] sm:w-[60%] mx-auto py-4 rounded-2xl flex justify-center items-center">
                                <button className="text-white flex justify-center items-center text-4xl" type="submit">Send a message<IoIosSend size={40} /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );


}