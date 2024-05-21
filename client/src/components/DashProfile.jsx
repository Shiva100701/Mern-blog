import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {updateStart, updateSuccess, updateFailure} from '../redux/user/userSlice'
import axios from "axios";


function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({})
  const [
    firebaseImageFielUploadingProgress,
    setFirebaseImageFielUploadingProgress,
  ] = useState(null);
  const [firebaseImageFielUploadingError, setFirebaseImageFielUploadingError] =
    useState(null);
  const fileRef = useRef();
  const dispatch = useDispatch()
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  // console.log(
  //   firebaseImageFielUploadingProgress,
  //   firebaseImageFielUploadingError
  // );

  const handleImageUpload = (e) => {
    // console.log(e);
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  // console.log(imgFile, imageFileUrl);

  useEffect(() => {
    if (imgFile) {
      uploadImage();
    }
  }, [imgFile]);

  const uploadImage = async () => {
    setImageFileUploading(true)
    setFirebaseImageFielUploadingError(null)
     const storage = getStorage(app);
     const fileName = new Date().getTime() + imgFile.name;
     const storageRef = ref(storage, fileName);
     const uploadTask = uploadBytesResumable(storageRef, imgFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; setFirebaseImageFielUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setFirebaseImageFielUploadingError(
          "Could not upload image (File must be less than 2MB)"
        );
        setFirebaseImageFielUploadingProgress(null);
        setImgFile(null);
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, photoUrl:downloadURL})
          setImageFileUploading(false)
        });
      }
    );
  };

  const handleChange = (e)=> {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  
const handleSubmit = async (e)=>{
  e.preventDefault();
  setUpdateUserError(null)
  setUpdateUserSuccess(null)
  if (Object.keys(formData).length === 0) {
    setUpdateUserError('No changes made')
    return;
  }
  if(imageFileUploading){
    setUpdateUserError('Please wait for image to upload!!')
    return
  }
  try {
    dispatch(updateStart());
    const res = await axios.put(`/api/user/update/${currentUser._id}`, formData);
    console.log(res);
    if (res) {
      dispatch(updateSuccess(res.data))
      setUpdateUserSuccess("User's profile update successfully")
    }else{
      dispatch(updateFailure("Please Upload Image less than 2Mb"))
          setUpdateUserError("Please wait for image to upload!!");

    }
    // console.log(res);
  } catch (error) {
    dispatch(updateFailure(" "));
  }
}


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => fileRef.current.click()}
        >
          {firebaseImageFielUploadingProgress && (
            <CircularProgressbar
              value={firebaseImageFielUploadingProgress || 0}
              text={`${firebaseImageFielUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    firebaseImageFielUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.photoUrl}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              firebaseImageFielUploadingProgress &&
              firebaseImageFielUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {firebaseImageFielUploadingError && (
          <Alert color="failure">{firebaseImageFielUploadingError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update  {/* Todo:: Updating when click on updtae */}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color={"failure"} className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}

export default DashProfile;
