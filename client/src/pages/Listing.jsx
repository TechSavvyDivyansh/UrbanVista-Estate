import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { Navigation } from 'swiper/modules';
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle'
import { FaMapMarkerAlt,FaBath,FaBed,FaParking,FaChair } from 'react-icons/fa';






export default function Listing() {

    const params = useParams()
    const[listing,SetListing]=useState(null)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(false)

    useEffect(()=>{
        const fetchListing=async()=>{
            try {
                setLoading(true)
                const res=await fetch(`/api/listing/get/${params.listingId}`)
                const data=await res.json()
                if(data.success===false)
                {
                    setError(true)
                    setLoading(false)
                    return;
                }
                SetListing(data)
                setError(false)
                setLoading(false)
                
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    },[params.listingId])


  return (
    <div>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-red-500 text-center my-7 text-xl'>Something went wrong🥴</p>}
        {listing && !error && !loading && (
            <div>
                <Swiper modules={[Navigation]} navigation>
                    {
                        listing.imageUrls.map((url)=>(
                            <SwiperSlide key={url}>
                                <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover',backgroundPosition:"center"}}></div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <div className="max-w-5xl mx-auto flex flex-col my-6 px-4 cursor-default">
                        <div className="flex gap-5 items-center font-semibold mt-5 ">
                            <p className='text-2xl'>{listing.name}- {listing.offer?<span className='text-gray-700 line-through ml-3 mr-4'>${listing.regularPrice.toLocaleString('en-us')}</span>:<span>${listing.regularPrice.toLocaleString('en-us')}</span>}{listing.offer?<span>${listing.discountPrice.toLocaleString('en-us')}</span>:""}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-7 mb-3">
                            <FaMapMarkerAlt color='green'/>
                            <p className='text-slate-700 font-medium text-sm'>{listing.address}</p>
                        </div>
                        <div className="flex gap-7 mb-3">
                            <button className='bg-red-900 text-white max-w-[180px] w-full rounded-lg py-1'>{listing.type=="rent"?"For Rent":"For Sale"}</button>
                            {listing.offer?<button className='bg-green-900 text-white max-w-[180px] w-full rounded-lg py-1'>Discount of ${+listing.regularPrice-+listing.discountPrice}</button>:""}
                        </div>
                        <p className='text-gray-800'><span className='font-semibold text-black'>Description</span> - {listing.description}</p>
                        <div className="flex gap-6 mt-5 flex-wrap">
                            <div className="bed flex gap-2 items-center">
                                <FaBed className='text-green-800'/>
                                <p>{listing.bedrooms} Beds</p>
                            </div>
                            <div className="bath flex gap-2 items-center">
                                <FaBath className='text-green-800'/>
                                <p>{listing.bathrooms} Baths</p>
                            </div>
                            {listing.parking?
                            <div className="parking flex gap-2 items-center">
                                <FaParking className='text-green-800'/>
                                <p>Parking Spot</p>
                            </div>:""}
                            {listing.furnished?
                            <div className="furnished flex gap-2 items-center">
                                <FaChair className='text-green-800'/>
                                <p>Furnished</p>
                            </div>:""}
                        </div>
                        <button className='bg-slate-800 text-white py-3 text-lg rounded-lg mt-11'>Contact LandLord</button>
                </div>
            </div>
        )}
             


    </div>
  )
}
