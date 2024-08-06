'use client'
import '@/layouts/grocerries.css';
import '@/layouts/main.css';
import InventoryNavbar from './inventory-nabar';
import { Inter } from 'next/font/google';
import { useContext } from '@/context/context';
import { CiSearch } from "react-icons/ci";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Camera } from "react-camera-pro";
import { FaDownload } from "react-icons/fa6";
import Switch from '@mui/material/Switch';
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { deleteDoc, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "@/utils/firebase";
import ItemCard from './item-card';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

const inter = Inter({ 
    weight: '600',
    subsets: ['latin'] 
});

const inter_thin = Inter({ 
    weight: '200',
    subsets: ['latin'] 
});

interface CameraRef {
    takePhoto: () => string;
}

interface NewItem {
    name: string,
    category: string,
    quantity: number,
    url: string,
}

interface Inventory {
    name: string,
    category: string,
    quantity: number,
    url: string,
}

interface InventoryOption {
    label: string;
    category: string;
    quantity: number;
}

export default function MainAbout() {
    const circles = Array(36).fill(null);
    const { currentInventoryPage } = useContext();
    const camera = useRef<CameraRef>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isPhotoReady, setIsPhotoReady] = useState<boolean>(false);
    const [generateImage, setGenerateImage] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(0);
    const [newItem, setNewItem] = useState<NewItem>({name: '', category: '', quantity: 0,url: ''});
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const { editDetect, setEditDetect } = useContext();
    const { searchPhrase, setSearchPhrase } = useContext();
    const [categoryList, setCategoryList] = useState<{ name: string; items: any; }[]>([]);

    const inventory_list: InventoryOption[] = inventory.map((item) => ({
        label: item.name,
        category: item.category,
        quantity: item.quantity
    }));

    const handleTakePhoto = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo);
            setIsPhotoReady(true);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
        setIsPhotoReady(true);
    };

    const handleMinus = () => {
        if (quantity > 0) {
            setQuantity(n => n - 1);
            setNewItem(item => ({ ...item, quantity: item.quantity - 1 }));
        }
    };

    const handlePlus = () => {
        setQuantity(n => n + 1);
        setNewItem(item => ({ ...item, quantity: item.quantity + 1 }));
    };

    const handleAddItem = async () => {
        if (image) {
            const imageUrl = await uploadImage(image);
            const itemWithImageUrl = { ...newItem, url: imageUrl };
            await addItem(itemWithImageUrl, newItem.category);
            setQuantity(0);
            setNewItem({ name: '', category: '', quantity: 0, url: '' });
            setImage(null);
        } else {
            const itemWithImageUrl = { ...newItem, url: '' };
            await addItem(itemWithImageUrl, newItem.category);
            setQuantity(0);
            setNewItem({ name: '', category: '', quantity: 0, url: '' });
            setImage(null);
        }
        setIsPhotoReady(false);
    };

    const updateInventory = async () => {
        const docs = await getDocs(collection(db, 'inventory'));
        const inventoryList = docs.docs.map(doc => doc.data());
        setInventory(inventoryList as Inventory[]);
    };

    const addItem = async (item: NewItem, category: string) => {
        const itemDocRef = doc(collection(db, 'inventory'), item.name);
        const itemDocSnap = await getDoc(itemDocRef);
    
        if (itemDocSnap.exists()) {
            const existingItem = itemDocSnap.data() as NewItem;
            await setDoc(itemDocRef, {
                ...existingItem,
                quantity: existingItem.quantity + item.quantity
            });
        } else {
            await setDoc(itemDocRef, { ...item });
        }

        const categoryDocRef = doc(collection(db, 'categories'), category);
        const categoryDocSnap = await getDoc(categoryDocRef);
    
        if (categoryDocSnap.exists()) {
            const data = categoryDocSnap.data() as { items: NewItem[] };
            const updatedItems = data.items || [];
            
            const existingItemIndex = updatedItems.findIndex(i => i.name === item.name);
            if (existingItemIndex !== -1) {
                updatedItems[existingItemIndex] = item;
            } else {
                updatedItems.push(item);
            }
            
            await setDoc(categoryDocRef, { items: updatedItems });
        } else {
            await setDoc(categoryDocRef, { items: [item] });
        }
    
        await updateInventory();
    };

    const uploadImage = async (imageDataUrl: string): Promise<string> => {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${new Date().getTime()}-${Math.random()}.png`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        return url;
    };

    useEffect(() => {
        updateInventory();
        getCategory()
    }, [editDetect]);

    const filterListBySearch = (searchPhrase: string) => {
        return inventory.filter(product => 
            product.name.toLowerCase().includes(searchPhrase.toLowerCase())
        );
    };

    const handleOnChange = (event: React.SyntheticEvent, newValue: typeof inventory_list[0] | null) => {
        if (newValue) {
            setSearchPhrase(newValue.label);
        } else {
            setSearchPhrase('');
        }
    };

    const filteredInventory = filterListBySearch(searchPhrase); 
    const selectedOption = inventory_list.find(item => item.label === searchPhrase);

    console.log("aksludgh INVENT: " + JSON.stringify(inventory_list))

    const getCategory = async () => {
        const categoryDocRef = collection(db, 'categories');
        const categoryDocSnap = await getDocs(categoryDocRef);
    
        const categoryPromises = categoryDocSnap.docs.map(async (doc) => {
            const categoryData = doc.data();
            const items = categoryData.items || []; 
            if (items.length > 0) {
                return {
                    name: doc.id,
                    items: items,
                };
            } else {
                return null; 
            }
        });
    
        const categoryListPrepare = await Promise.all(categoryPromises);
        const filteredCategoryList = categoryListPrepare.filter(category => category !== null);
    
        setCategoryList(filteredCategoryList);
    };

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
            <div className="rounded-2xl w-full h-full z-20 bg-white px-4 flex flex-col">
                <InventoryNavbar />
                <div className='w-full py-4 overflow-auto'>
                    {currentInventoryPage === 'inventory' && 
                            <>
                                <div className='h-[40px] flex sm:justify-between items-center'>
                                    <div className='w-[40%] h-full p-1 flex'>
                                        <input 
                                            className='border-b-2 border-[#787a7d] w-full h-full outline-none px-1' 
                                            placeholder='Name of product' 
                                            onChange={(e) => setSearchPhrase(e.target.value)}
                                        />
                                    </div>

                                    <div className='w-[30%] h-full flex items-center'>
                                    <Autocomplete
                                        className='w-full scale-75'
                                        options={inventory_list}
                                        value={selectedOption || null} 
                                        onChange={handleOnChange}
                                        sx={{ height: 70, m: 4 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Inventory"
                                                sx={{ py: -4 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    readOnly: true, 
                                                }}
                                                onClick={(e) => e.stopPropagation()}  
                                                onKeyDown={(e) => e.preventDefault()}
                                            />
                                        )}
                                    />
                                    </div> 
                                </div>
                                <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-1 gap-4'>
                                    {filteredInventory.map(item => ( 
                                        <ItemCard 
                                            name={item.name} 
                                            category={item.category} 
                                            quantity={item.quantity} 
                                            url={item.url} 
                                            key={item.name} 
                                            item={item} 
                                        />
                                    ))}
                                </div>
                            </>
                        }
                        {currentInventoryPage === 'addItem' &&
                        <div className='w-full flex-1 h-full'>
                            <div className='grid sm:grid-cols-2 grid-cols-1 sm:gap-0 gap-16 w-full h-full'>
                                <div className='block justify-center'>
                                    <div className={`camera-container relative w-[80%] h-[300px] sm:h-[350px] xl:h-[250px] my-[5%] flex justify-center mx-auto ${generateImage ? 'hidden' : ''}`}>
                                        {!isPhotoReady ? 
                                        <>
                                            <Camera ref={camera} aspectRatio="cover" errorMessages={{
                                                    noCameraAccessible: undefined,
                                                    permissionDenied: undefined,
                                                    switchCamera: undefined,
                                                    canvas: undefined
                                                }}/>
                                            <button onClick={handleTakePhoto} className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded hover:bg-stone-500 duration-300 ease-in-out hover:text-white">
                                                Take photo
                                            </button>
                                            {image && <img src={image} alt="Taken photo" className="top-2 left-1/2 transform -translate-x-1/2 w-[80%] h-[80%] object-cover rounded-2xl" />}
                                        </>
                                            :
                                        <div className='flex justify-center items-center'>
                                            {image && <img src={image} alt="Taken photo" className="relative left-1/2 transform -translate-x-1/2 w-[100%] h-[100%] rounded-2xl" />}
                                        </div>
                                        }      
                                    </div>
                                    <div className={`flex items-center justify-center px-[10%] ${generateImage ? 'hidden' : ''}`}>
                                        <div className='relative flex items-center justify-center rounded-2xl border-2 w-[60%] p-2 border-dashed border-green-400 bg-green-200 hover:bg-green-600 ease-in-out duration-300'>
                                            <FaDownload className=' cursor-pointer' size={50} />
                                            <input className='absolute inset-0 opacity-0 cursor-pointer' type="file" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1 block'>
                                    <div className=' w-full grid grid-rows-4 h-full px-[5%]'>
                                        <div className='h-full row-span-1'>
                                            <div className=' flex justify-center items-center'>
                                                <h1 className={`${inter.className} text-2xl uppercase text-[#fad882] text-shadow-navbar tracking-widest`}>Name</h1>
                                            </div>
                                            <div className=' flex justify-center items-center'>
                                                <input 
                                                    className='border-2 border-stone-300 bg-stone-300 rounded-lg outline-none px-2' 
                                                    type='text'
                                                    value={newItem.name}
                                                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className='h-full row-span-1'>
                                            <div className=' flex justify-center items-center'>
                                                <h1 className={`${inter.className} text-2xl uppercase text-[#fad882] text-shadow-navbar tracking-widest`}>Category</h1>
                                            </div>
                                            <div className=' flex justify-center items-center'>
                                                <input 
                                                    className='border-2 border-stone-300 bg-stone-300 rounded-lg outline-none px-2' 
                                                    type='text'
                                                    value={newItem.category}
                                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className='h-full row-span-1'>
                                            <div className='flex justify-center items-center mb-[5%]'>
                                                <h1 className={`${inter.className} text-2xl uppercase text-[#fad882] text-shadow-navbar tracking-widest`}>Quantity</h1>
                                            </div>
                                            <div className='flex items-center justify-around'>
                                                <FaPlusCircle className='text-[#54e586] cursor-pointer' onClick={handlePlus} size={35} />
                                                <h1>{quantity}</h1>
                                                <FaMinusCircle className='text-red-600 cursor-pointer' onClick={handleMinus} size={35} />
                                            </div>
                                        </div>
                                        <div className='h-full row-span-1 flex justify-center items-center py-4'>
                                            <div 
                                                className='border-2 cursor-pointer border-green-400 hover:bg-green-600 ease-in-out duration-300 bg-green-200 text-2xl p-4 rounded-full w-[60%] text-center'
                                                onClick={handleAddItem}>
                                                ADD ITEM
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                }
                {currentInventoryPage === 'category' && 
                    <div className='w-full flex-1 h-full'>
                        <div className='grid grid-cols-4'>
                            <div className='col-span-1 flex-1'>
                            {categoryList.map((category, index) => (
                                <SimpleTreeView key={index} className="overflow-hidden rounded-2xl">
                                    <TreeItem2 sx={{my:1}} itemId={`category-${index}`} label={category.name}>
                                        {category.items.map((item, itemIndex) => (
                                            <TreeItem2 
                                                key={itemIndex} 
                                                itemId={`item-${index}-${itemIndex}`} 
                                                label={item.name} 
                                                onClick={() => setSearchPhrase(item.name)}
                                            />
                                        ))}
                                    </TreeItem2>
                                </SimpleTreeView>
                            ))}
                            </div>
                            <div className='col-span-3 flex-1 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 md:px-[20%] lg:px-[5%] gap-4 px-[5%]'>
                                {filteredInventory.map(item => ( 
                                    <ItemCard 
                                        name={item.name} 
                                        category={item.category} 
                                        quantity={item.quantity} 
                                        url={item.url} 
                                        key={item.name} 
                                        item={item} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>   
                }
                </div>
            </div>
        </div>
    );
}
