import React, { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import {Link} from 'react-router-dom'

import { Navigation, Pagination, Scrollbar, A11y ,EffectFade} from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade'

import forest from '../assets/bg/1.jpg'
import penthouse from '../assets/bg/15-canopy-penthouse-401-primary-bedroom-patio-2400x1350-1.jpg'
import snow from '../assets/bg/chalet_v02_final.png'
import snow2 from '../assets/bg/imagereader.jpg'
import modern from '../assets/bg/modern-house-water-feature-200922-1226-01.jpg'



export default function Home() {

  const [offerListing,setOfferListing]=useState([])
  const [RentListing,setRentListing]=useState([])
  const [SaleListing,setSaleListing]=useState([])


  useEffect(()=>{
      const fetchOfferListing=async()=>{
        try {
            const res=await fetch(`/api/listing/get?offer=true&limit=4`)
            const data=await res.json()
            setOfferListing(data)
          
        } catch (error) {
            console.log(error)
        }
      }

      fetchOfferListing()

      const rentListing=async()=>{
        try {
            const res=await fetch(`/api/listing/get?type=rent&limit=4&sort=createdAt&order=asc`)
            const data=await res.json()
            setRentListing(data)
          
        } catch (error) {
            console.log(error)
        }
      }

      rentListing()

      const saleListing=async()=>{
        try {
            const res=await fetch(`/api/listing/get?type=sale&limit=4`)
            const data=await res.json()
            setSaleListing(data)
          
        } catch (error) {
            console.log(error)
        }
      }

      saleListing()

  },[])


  return (
    <div className=''>
        <div className="hero w-[100vw]">
            <div className="text flex flex-col gap-5 w-fit p-9 h-full sm:h-[30vh]">
                  <div className="max-w-fit">
                      <p className='text-5xl text-slate-700 font-bold cursor-default'>Find your next <span className='text-slate-500'>perfect</span></p>
                      <p className='text-5xl text-slate-700 font-bold cursor-default'>Place with ease</p>
                  </div>
                  <div className="max-w-fit">
                    <p className='text-sm text-slate-500 cursor-default'>Urban Vista estate is there for you to find homes fast,easy and comfortable</p>
                    <p className='text-sm text-slate-500 cursor-default'>Get in touch with our experts</p>
                  </div>
                  <div className="max-w-fit">
                    <p className='text-blue-500 font-semibold cursor-pointer'>Explore now...</p>
                  </div>
            </div>
            <div className="background h-[30vh] sm:h-[60vh]">
                  <Swiper
                    slidesPerView={1}
                  >
                        <SwiperSlide><img src={forest} alt="" className='h-[30vh] w-[100vw] sm:h-[60vh] '/></SwiperSlide>
                        <SwiperSlide><img src={penthouse} alt="" className='h-[30vh] w-[100vw] sm:h-[60vh] '/></SwiperSlide>
                        <SwiperSlide><img src={snow} alt="" className='h-[30vh] w-[100vw] sm:h-[60vh] '/></SwiperSlide>
                        <SwiperSlide><img src={snow2} alt="" className='h-[30vh] w-[100vw] sm:h-[60vh] '/></SwiperSlide>
                        <SwiperSlide><img src={modern} alt="" className='h-[30vh] w-[100vw] sm:h-[60vh] '/></SwiperSlide>
                  </Swiper>
            </div>
        </div>



        <div className="card-display">
                <div className="flex flex-col items-center mx-auto max-w-fit">
                    <div className="text m-8 flex flex-col items-center">
                      <h1 className='text-slate-600 font-bold text-xl cursor-default'>Recent Offers</h1>
                      <Link to={`/search?offer=true`}><p className='text-blue-700 cursor-pointer text-sm'>Show more places with offer</p></Link>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {offerListing.map((offerList)=>{
                            return <ListingCard listing={offerList} key={offerList._id}/>
                        })}
                    </div>
                </div>
                <div className=" flex flex-col items-center mx-auto ">
                    <div className="text m-8 flex flex-col items-center">
                      <h1 className='text-slate-600 font-bold text-xl cursor-default'>Recent Rent estates</h1>
                      <Link to={`/search?type=rent`}><p className='text-blue-700 cursor-pointer text-sm'>Show more places having rent stays</p></Link>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {RentListing.map((rentList)=>{
                            return <ListingCard listing={rentList} key={rentList._id}/>
                        })}
                    </div>
                </div>
                <div className=" flex flex-col items-center mx-auto mb-5">
                    <div className="text m-8 flex flex-col items-center">
                      <h1 className='text-slate-600 font-bold text-xl cursor-default'>Recent estates to be sold</h1>
                      <Link to={`/search?type=sale`}><p className='text-blue-700 cursor-pointer text-sm'>Show more places to be sold</p></Link>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {SaleListing.map((saleList)=>{
                            return <ListingCard listing={saleList} key={saleList._id}/>
                        })}
                    </div>
                </div>
        </div>
    </div>
  )
}
