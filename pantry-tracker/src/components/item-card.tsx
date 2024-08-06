import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import Image from 'next/image';
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { ChangeEvent, useRef, useState } from "react";
import { runTransaction, doc, collection, getDoc, setDoc, deleteDoc } from "firebase/firestore"; 
import { FaDownload } from "react-icons/fa6";
import { db } from "@/utils/firebase";
import { MdPhotoCamera } from "react-icons/md";
import { Camera } from "react-camera-pro";
import { IoMdClose } from "react-icons/io";
import { useContext } from "@/context/context";

interface ItemCardProps {
    name: string;
    category: string;
    quantity: number;
    url: string;
    item: {
        name: string;
        category: string;
        quantity: number;
        url: string;
    };
}

interface NewItem {
    name: string,
    category: string,
    quantity: number,
    url: string,
}

interface CameraRef {
    takePhoto: () => string;
}

export default function ItemCard({ name, category, quantity, url, item}: ItemCardProps) {
    const [isEdited, setIsEdited] = useState(false);
    const [newItem, setNewItem] = useState<NewItem>({ name, category, quantity, url });
    const [count, setCount] = useState(quantity);
    const [image, setImage] = useState<string | null>(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
    const [isPhotoReady, setIsPhotoReady] = useState<boolean>(false);
    const [editedItem, setEditedItem] = useState({ ...item });
    const camera = useRef<CameraRef>(null);

    const { editDetect, setEditDetect } = useContext();

    const handleTakePhoto = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo);
            setIsPhotoReady(true);
            setNewItem(item => ({ ...item, url: photo }));
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setNewItem(item => ({ ...item, url: reader.result as string }));
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAddItem = async () => {
        try {
            
            if (name !== newItem.name) {
                const newItemDocRef = doc(db, 'inventory', newItem.name);
                console.log("Updating inventory item:", JSON.stringify(newItem));
                await setDoc(newItemDocRef, { ...newItem }, { merge: true });
    
                const oldItemDocRef = doc(db, 'inventory', name);
                await deleteDoc(oldItemDocRef);
            } else {
                const itemDocRef = doc(db, 'inventory', name);
                console.log("Updating inventory item (no name change):", JSON.stringify(newItem));
                await setDoc(itemDocRef, { ...newItem }, { merge: true });
            }
    
            if (category) {
                const oldCategoryDocRef = doc(db, 'categories', category);
                const oldCategoryDocSnap = await getDoc(oldCategoryDocRef);
    
                if (oldCategoryDocSnap.exists()) {
                    const oldData = oldCategoryDocSnap.data() as { items: NewItem[] };
                    console.log("Current items in old category:", JSON.stringify(oldData.items));
    
                    const updatedOldItems = oldData.items.filter(i => i.name !== name);
                    console.log("Updated items list after removal from old category:", JSON.stringify(updatedOldItems));
                    await setDoc(oldCategoryDocRef, { items: updatedOldItems });
                } else {
                    console.error("Old category does not exist.");
                }
            }
    
            const newCategoryDocRef = doc(db, 'categories', newItem.category);
            const newCategoryDocSnap = await getDoc(newCategoryDocRef);
    
            if (newCategoryDocSnap.exists()) {
                const newData = newCategoryDocSnap.data() as { items: NewItem[] };
                console.log("Current items in new category:", JSON.stringify(newData.items));
                const updatedNewItems = [...newData.items, newItem];
                console.log("Updated items list after addition to new category:", JSON.stringify(updatedNewItems));
                await setDoc(newCategoryDocRef, { items: updatedNewItems });
            } else {
                console.log("No category document found for new category. Creating new category.");
                await setDoc(newCategoryDocRef, { items: [newItem] });
            }
    
            setCount(newItem.quantity);
            setIsEdited(false);
            setEditDetect(!editDetect);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };
    
    

    const getImageSrc = () => {
        if (newItem.url) {
            return newItem.url;
        }
        return '/default-image.png'; 
    };


    const handleMinus = () => {
        if (count > 0) {
            setCount(n => n - 1);
            setNewItem(item => ({ ...item, quantity: item.quantity - 1 }));
        }
    };

    const handlePlus = () => {
        setCount(n => n + 1);
        setNewItem(item => ({ ...item, quantity: item.quantity + 1 }));
    };
    
    const deleteItem = async (itemName: string, category: string) => {
        const itemDocRef = doc(collection(db, 'inventory'), itemName);
        const categoryDocRef = doc(collection(db, 'categories'), category);
        
        try {
            await deleteDoc(itemDocRef);
    
            const categoryDocSnap = await getDoc(categoryDocRef);
            
            if (categoryDocSnap.exists()) {
                const data = categoryDocSnap.data() as { items: NewItem[] };
                const updatedItems = data.items.filter(item => item.name !== itemName);
    
                if (updatedItems.length > 0) {
                    await setDoc(categoryDocRef, { items: updatedItems });
                } else {
                    await deleteDoc(categoryDocRef);
                }
            }
    
            setEditDetect(!editDetect);
        } catch (error) {
            console.error("Error deleting item or updating category:", error);
        }
    };
    return (
        <div className="flex justify-center items-center w-full h-full py-2">
            <div className="w-full h-full rounded-2xl py-4 bg-[#fad882] border border-[#f7c102]">
                <div className="flex items-center justify-end gap-4">
                    <CiEdit className="cursor-pointer hover:scale-125" onClick={() => setIsEdited(!isEdited)} size={30} />
                    <MdDeleteForever className="cursor-pointer hover:scale-125" onClick={() => deleteItem(name,category)}  size={30} />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                    {isTakingPhoto ?
                        <div className="flex w-[80%] h-[400px] my-[5%] justify-center mx-auto z-20">
                            <div>
                                <Camera ref={camera} aspectRatio="cover" />
                                {image && <img src={image} alt="Taken photo" className="top-2 left-1/2 transform -translate-x-1/2 w-[80%] h-[80%] object-cover rounded-2xl" />}
                            </div>
                            <button onClick={handleTakePhoto} className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded hover:bg-stone-500 duration-300 ease-in-out hover:text-white">
                                    Take photo
                            </button>
                            <div className="absolute top-2 right-0 transform -translate-x-1/2">
                                <IoMdClose className=" cursor-pointer" size={40} onClick={() => setIsTakingPhoto(false)}/>
                            </div>
                        </div>
                        :
                        <Image className="w-[80%] h-[80%] rounded-2xl" width={3000} height={3000} src={getImageSrc()} alt={name} />
                    }
                </div>
                {isEdited ?
                    <>
                        <div className="flex items-center justify-center text-2xl py-2">
                            <span className="w-[30%]">Name:</span>
                            <input
                                className='border-2 border-stone-300 bg-stone-300 rounded-lg outline-none px-2 w-[80%]' type='text'
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-center text-2xl py-2">
                            <span className="w-[40%]">Category:</span>
                            <input
                                className='border-2 border-stone-300 bg-stone-300 rounded-lg outline-none px-2 w-[70%]' type='text'
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-center text-2xl py-2">
                            <div 
                                className="relative mx-1 cursor-pointer flex items-center justify-center rounded-2xl border-2 w-[60%] border-dashed border-green-400 bg-green-200 hover:bg-green-600 ease-in-out duration-300"
                                onClick={() => setIsTakingPhoto(true)}>
                                <MdPhotoCamera size={30}/>
                            </div>
                            <div className='relative mx-1 flex items-center justify-center rounded-2xl border-2 w-[60%] border-dashed border-green-400 bg-green-200 hover:bg-green-600 ease-in-out duration-300 cursor-pointer'>
                                <FaDownload className='' size={30} />
                                <input className='absolute inset-0 opacity-0' type="file" onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="flex items-center justify-around my-2">
                            <div className='flex items-center justify-around'>
                                <FaPlusCircle className='text-[#54e586] cursor-pointer mx-2' onClick={handlePlus} size={35} />
                                <h1>{count}</h1>
                                <FaMinusCircle className='text-red-600 cursor-pointer mx-2' onClick={handleMinus} size={35} />
                            </div>
                        </div>
                        <div onClick={handleAddItem} className='border-2 cursor-pointer border-green-400 hover:bg-green-600 ease-in-out duration-300 bg-green-200 p-2 rounded-full w-[60%] text-center mx-auto'>
                            EDIT ITEM
                        </div>
                    </>
                    :
                    <>
                        <div className="flex items-center justify-center text-2xl py-2">
                            Name:<span className=" overflow-hidden">{name}</span>
                        </div>
                        <div className="flex items-center justify-center text-2xl py-2">
                            Category:<span className=" overflow-hidden">{category}</span>
                        </div>
                        <div className="flex items-center justify-around">
                            <h1>{count}</h1>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
