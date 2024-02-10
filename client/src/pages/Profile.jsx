import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { updateUserStart,updateUserSuccess,updateUserError,deleteUserStart,deleteUserSuccess,deleteUserError,signoutUserStart,signoutUserSuccess,signoutUserError } from "../redux/user/userSlice.js";
import {Link} from 'react-router-dom'


export default function Profile() {
  const { currentUser,Loading,DispError } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [FileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false)
  const[showListingError,setShowListingError]=useState(false)
  const [UserListing,setUserListing]=useState([])
  const dispatch=useDispatch()





  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "your-storage-path/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  let Imgcomment = () => {
    if (FileUploadError) {
      return <span className="text-red-700">Error in uploading image</span>;
    } else if (filePercentage > 0 && filePercentage < 100) {
      return (
        <span className="text-slate-700">{`uploading ${filePercentage}%`}</span>
      );
    } else if (filePercentage == 100 && !FileUploadError) {
      return (
        <span className="text-green-700">File uploaded Successfully!!</span>
      );
    } else {
      return "";
    }
  };


  const handleUpdateChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }


  const handleUpdateSubmit=async(e)=>{
      e.preventDefault()
      try {
          dispatch(updateUserStart())
          const res=await fetch(`/api/user/update/${currentUser._id}`,{
              method:"PATCH",
              headers:{
                'Content-type':'application/json',
              },
              body:JSON.stringify(formData)
          })
          let data=await res.json()

          if(data.success==false)
          {
            dispatch(updateUserError(data.message))
            setUpdateSuccess(false)
            return
          }
          dispatch(updateUserSuccess(data))
          setUpdateSuccess(true)
        
      } catch (error) {
         dispatch(updateUserError(error.message))
         setUpdateSuccess(false)
      }
  }


  const handleDeleteUser=async()=>{
    try {
        dispatch(deleteUserStart())
        const res=await fetch(`/api/user/delete/${currentUser._id}`,{
          method:'DELETE'
        })
        const data=res.json()

        if(data.success==false)
        {
          dispatch(deleteUserError(data.message))
          return;
        }
        dispatch(deleteUserSuccess(data))
        
      } catch (error) {
          dispatch(deleteUserError(error.message))
      }
  }

  const handleSignOut=async()=>{
    try {
      dispatch(signoutUserStart())
      const res=await fetch('/api/auth/signout')
      const data=await res.json()
      if(data.success==false)
      {
         dispatch(signoutUserError(data.message))
         return;
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
        dispatch(signoutUserError(error.message))
    }
  }


  const handleShowListing=async()=>{
    try {

      setShowListingError(false)
      const res=await fetch(`/api/user/listing/${currentUser._id}`)
      const data=await res.json()

      if(data.success===false)
      {
        setShowListingError(true)
        return;
      }
      setUserListing(data)
      
    } catch (error) {
        setShowListingError(true)
    }
  }

  const handleListingDelete=async(listingId)=>{
      try {
        const res=await fetch(`/api/listing/delete/${listingId}`,{
          method:"DELETE"
        })
        const data=await res.json()

        if(data.success===false)
        {
          console.log(data.message);
          return;
        }

        setUserListing((prev)=>prev.filter((listing)=>listing._id!==listingId))


      } catch (error) {
        log(error.message)
      }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData?.avatar || currentUser.avatar}
          alt="profile image"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-center">{Imgcomment()}</p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleUpdateChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleUpdateChange}
        />
        <input
          type="password"
          placeholder="New password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleUpdateChange}
        />
        <button disabled={Loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {Loading?"Loading...":"Update"}
        </button>
        <Link to='/create-listing' className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
        <span className="text-gray-900 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className="text-red-600 mt-5">{DispError?DispError:""}</p>
      <p className="text-green-700 mt-5">{updateSuccess?"User is updated Successfully🥳":""}</p>
      <button onClick={handleShowListing} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError?"Error in showing listing":""}</p>

      {UserListing && UserListing.length>0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl mt-7 font-semibold text-slate-700">Your Listings</h1>
            {
              UserListing.map((listing)=>{
                return <div className="border rounded-lg my-3 p-3 flex justify-between items-center gap-4" key={listing._id}>
                          <Link to={`/listing/${listing._id}`}>
                              <img src={listing.imageUrls[0]} alt="" className="h-16 w-16 object-contain"/>
                          </Link>
                          <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                              <p>{listing.name}</p>
                          </Link>
                          <div className="flex flex-col items-center">
                              <button onClick={()=>{handleListingDelete(listing._id)}} className="text-red-700 uppercase">Delete</button>
                              <Link to={`/update-listing/${listing._id}`}><button className="text-green-700 uppercase">Edit</button></Link>
                          </div>
                      </div>
                  })
            }
        </div>
      }
    </div>
  );
}
