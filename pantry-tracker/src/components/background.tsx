import '@/layouts/background.css'


export default function Background(){



    return (
        <div className="min-h-screen w-full bg-white overflow-hidden flex justify-center items-center absolute -z-10">
            <div className="circle-left-bottom bg-[#e9f1fc] absolute left-0 bottom-0 w-[400px] h-[300px]"></div>
            <div className="elipse-right-top bg-[#e9f1fc] absolute top-0 w-[1200px] h-[800px] -right-[75px] overflow-hidden"></div>
        </div>
    );
}