import React, { useState } from 'react'
import {getDownloadURL, getStorage, uploadBytesResumable,ref } from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'


export default function CreateListing() {
  const {currentUser}=useSelector(state=>state.user)
  const navigate=useNavigate()

  const [files, setFiles] = useState([])
  const [formData,setFormData]=useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    regularPrice:50,
    discountPrice:0,
    bathrooms:1,
    bedrooms:1,
    furnished:false,
    parking:false,
    type:'rent',
    offer:false,
    

  })
  console.log(formData)
  const [imageUploadError,setImageUploadError]=useState(false)
  const [imgUpload,setImgUpload]=useState(false)
  const [listingError,setListingError]=useState(false)
  const [listingLoad,setListingLoad]=useState(false)



  const handleImgSubmit = (e) => {
    if (files.length > 0 && files.length+formData.imageUrls.length< 7) 
    {
          setImgUpload(true)
          setImageUploadError(false)


          const promises = [];

          for (let i = 0; i < files.length; i++) {
            promises.push(storeImg(files[i]));
          }
          Promise.all(promises).then((urls)=>{
            setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)})
            setImageUploadError(false)
            setImgUpload(false)


          }).catch((err)=>{
            setImageUploadError('Image Upload Failed😞')
          })
    }
    else
    {
        setImageUploadError("You can upload only 6 images and minimum should be 1")
        setImgUpload(false)
    }
  };

  const storeImg = async (file) => {
      return new Promise((resolve, reject) => 
      {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed",(snapshot)=>{
                    const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
                    console.log(`uploaded bytes is ${progress}%`)
                  },
                  (err) => {
                    reject(err);
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                      resolve(downloadUrl);
                    });
                  }
            );
      });
  };


  const handleRemoveImg=(index)=>{
      setFormData({
          ...formData,
          imageUrls: formData.imageUrls.filter((_,i)=>{
              return i!==index
          })
      })
  }


  const handleChange=(e)=>{
      if(e.target.id==='sale' || e.target.id==='rent')
      {
         setFormData({
          ...formData,
          type:e.target.id 
         })
      }
      if(e.target.id==='parking' || e.target.id==='furnished'||e.target.id==='offer')
      {
          setFormData({
              ...formData,
              [e.target.id]:e.target.checked
          })
      }
      if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea')
      {
        setFormData({
          ...formData,
          [e.target.id]:e.target.value

        })
      }
  }

  const handleListingSubmit=async(e)=>{
      e.preventDefault()

      if(formData.imageUrls.length<1) return setListingError("You must upload atleast one image!!📷")
      if(+formData.regularPrice<+formData.discountPrice) return setListingError("Discounted pice should be less than regular price💵")

      try {
        setListingLoad(true)
        setListingError(false)

        const res=await fetch('/api/listing/create',{
          method:"POST",
          headers:{
            'Content-type':'application/json'
          },
          body:JSON.stringify({
            ...formData,
            userRef:currentUser._id
          })
        })

        const data=await res.json()
        setListingLoad(false)
        if(data.success===false)
        {
          setListingError(data.message)

        }
        navigate(`/listing/${data._id}`)

        
      } catch (error) {
        setListingError(error.message)
        setListingLoad(false)
        
      }
  }


  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6" onSubmit={handleListingSubmit}>
        <div className="leftcol flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="checkboxes flex gap-6 flex-wrap">
            <div className="sell flex gap-2">
              <input type="checkbox" id="sale" className="w-5 cursor-pointer" onChange={handleChange} checked={formData.type==='sale'}/>
              <span>Sell</span>
            </div>
            <div className="rent flex gap-2">
              <input type="checkbox" id="rent" className="w-5 cursor-pointer" onChange={handleChange} checked={formData.type==='rent'}/>
              <span>Rent</span>
            </div>
            <div className="parking flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 cursor-pointer"
                onChange={handleChange} checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="furnished flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 cursor-pointer"
                onChange={handleChange} checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="offer flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 cursor-pointer"
                onChange={handleChange} checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="bedrooms flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="bathrooms flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="regularPrice flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">($/month)</span>
              </div>
            </div>
            {formData.offer && (
                    <div className="discountPrice flex items-center gap-2">
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max="100000"
                      className="p-3 border border-gray-300 rounded-lg"
                      required
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p>Discounted Price</p>
                      <span className="text-sm">($/month)</span>
                    </div>
                  </div>
            )}
          </div>
        </div>
        <div className="rightcol flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e)=>setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full cursor-pointer"
            />
            <button type='button' onClick={handleImgSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50" disabled={imgUpload}>
              {imgUpload?"Uploading...":"Upload"}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {
              formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>{
                return <div className='flex justify-between p-3 border items-center' key={index}>
                    <img src={url} alt="listing img" className='w-20 h-20 object-contain rounded-lg'/>
                    <button type='button' onClick={()=>{handleRemoveImg(index)}} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                </div>
              })
          }

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-50" disabled={listingLoad||imgUpload}>
            {listingLoad?"Creating...":"Create Listing"}
          </button>
          {listingError && <p className='text-red-700 text-sm'>{listingError}</p>}
        </div>
        
      </form>
    </main>
  );
}
