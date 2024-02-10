import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    DispError:null,
    Loading:false
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.Loading=true
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.Loading=false;
            state.DispError=null;
        },
        signInFailiure:(state,action)=>{
            state.DispError=action.payload;
            state.Loading=false;
        },
        updateUserStart:(state)=>{
            state.Loading=true
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload
            state.Loading=false
            state.DispError=null
        },
        updateUserError:(state,action)=>{
            state.DispError=action.payload
            state.Loading=false
        },
        deleteUserStart:(state)=>{
            state.Loading=true
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null
            state.Loading=false
            state.DispError=null
        },
        deleteUserError:(state,action)=>{
            state.DispError=action.payload
            state.Loading=false
        },
        signoutUserStart:(state)=>{
            state.Loading=true
        },
        signoutUserSuccess:(state)=>{
            state.currentUser=null
            state.Loading=false
            state.DispError=null
        },
        signoutUserError:(state,action)=>{
            state.DispError=action.payload
            state.Loading=false
        }
    }
})

export const {signInStart,signInSuccess,signInFailiure,updateUserStart,updateUserSuccess,updateUserError,deleteUserStart,deleteUserSuccess,deleteUserError,signoutUserStart,signoutUserSuccess,signoutUserError}=userSlice.actions;
export default userSlice.reducer; 