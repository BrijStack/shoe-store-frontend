import ProductsDetailCarousel from '@/components/ProductsDetailCarousel'
import RelatedProducts from '@/components/RelatedProducts'
import Wrapper from '@/components/Wrapper'
import { addToCart } from '@/store/cartSlice'
import { fetchDataFromApi } from '@/utils/api'
import { getDiscountedPricePercentage } from '@/utils/helper'
import React, { useState } from 'react'
import {IoMdHeartEmpty} from 'react-icons/io'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { useSelector, useDispatch } from 'react-redux'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductDetails = ({product, products}) => {

    const [selectedSize,setSelectedSize] = useState();
    const [showError,setShowError] = useState(false);
    const p = product?.data?.[0]?.attributes;

    const dispatch = useDispatch()

    const notify = () =>{
        toast.success('Success. Check Your Cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            }); 
    }

  return (
    <div className='w-full md:py-20'>
        <ToastContainer />
        <Wrapper>
            <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px] '>
                {/* Left Column Start */}
                <div className='w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0'>
                    <ProductsDetailCarousel images={p?.image?.data}/>
                </div>
                {/* Left Column End */}

                {/* Right Column Start */}
                <div className="flex-[1] py-3">
                        {/* PRODUCT TITLE */}
                        <div className="text-[34px] font-semibold mb-2 leading-tight">
                            {p.name}
                        </div>
                        <div className="text-lg font-semibold mb-5">
                           {p.subtitle}
                        </div>
                        {/* PRODUCT PRICE */}
                        <div className="flex items-center">
                            <p className="mr-2 text-lg font-semibold">
                               MRP: ₹{p.price}
                            </p>
                            {p.original_price && (
                                <>
                                    <p className='text-base font-medium line-through'>
                                        ₹{p.original_price}
                                    </p>
                                     <p className='ml-auto text-base font-medium text-green-500 '>
                                        {getDiscountedPricePercentage(p.original_price, p.price) }% off
                                    </p> 
                                </>
                            )}
                        </div>
                        <div className="text-sm font-medium text-black/[0.5]">
                            incl. of taxes
                        </div>
                        <div className="text-sm font-medium text-black/[0.5] mb-20">
                            {`(Also includes all applicable duties)`}
                        </div>
                          {/* PRODUCT SIZE RANGE START */}
                            <div className="mb-10">
                                {/* HEading Start */}
                                <div className='flex justify-between mb-2'>
                                    <div className='text-sm font-semibold'>
                                        Select Size
                                    </div>
                                    <div className=' text-sm font-medium text-black/[0.5]'>
                                        Select Guide
                                    </div>
                                </div>
                                {/* Heading End */}

                                {/* Size Start */}
                                <div className='grid grid-cols-3 gap-2' id="SizesGrid">
                                    {p.size.data.map((item, i) => (
                                        <div key={i} className={`border rounded-md text-center py-3 font-medium 
                                        ${item.enabled ? 'hover:border-black cursor-pointer': 'cursor-not-allowed bg-black/[0.1] opacity-50'} ${selectedSize === item.size ? 'border-black':''}`}
                                            onClick={() => {
                                                setSelectedSize(item.size)
                                                setShowError(false);
                                            }}
                                        >
                                       {item.size}
                                    </div> 
                                    ))}
                                </div>
                                {/* Size End */}

                            {/* SHOW ERROR START */}
                               {showError && (<div className="text-red-600 mt-1">
                                    Size selection is required
                                </div>)}
                            {/* SHOW ERROR END */}        
                            </div>
                         {/* PRODUCT SIZE RANGE END */}

                         <button className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
                            onClick={() => {

                                if(!selectedSize){
                                    setShowError(true);
                                    document.getElementById("SizesGrid").scrollIntoView({
                                        block:"center",
                                        behavior:"smooth"
                                    })
                                }else{

                                    dispatch(
                                        addToCart({
                                        ...product?.data?.[0],
                                        selectedSize,
                                        oneQuantityPrice: p.price
                                    }))
                                    notify();
                                }

                            }}  
                         >
                            Add To Cart
                         </button>
                          {/* WHISHLIST BUTTON START */}
                        <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
                            Whishlist
                            <IoMdHeartEmpty size={20} />
                        </button>
                        {/* WHISHLIST BUTTON END */}

                        <div>
                            <div className="text-lg font-bold mb-5">
                                    Product Details
                            </div>
                            <div className='markdown text-sm mb-5'>
                            <ReactMarkdown>
                            {p.description}
                            </ReactMarkdown>
                            </div>
                        </div>
                </div>
                {/* Right Column End */}
            </div>
            <div>
                <RelatedProducts products={products} />
            </div>
        </Wrapper>
    </div>
  )
}

export default ProductDetails


export async function getStaticPaths(){
    const products = await fetchDataFromApi('/api/products?populate=*');
  
    const paths = products.data.map((p) => ({
      params: {
        slug: p.attributes.slug
      }
    }))
    
    return{
      paths,
      fallback: false  
    }
  }

  export async function getStaticProps({params: {slug}}){
    const product = await fetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`)
    const products = await fetchDataFromApi(`/api/products?populate=*&[filters][slug][$ne]=${slug}`)
  
    return {
      props: {
       product,
       products
      }
    }
  }