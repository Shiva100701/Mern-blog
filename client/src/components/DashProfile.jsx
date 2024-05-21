import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
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
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteSuccess,
  deleteStart, deleteFailure, signoutSuccess
} from "../redux/user/userSlice";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {Link} from 'react-router-dom'


function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
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

  const [showModal, setShowModal] = useState(false)
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

const handleDelete = async()=>{
  setShowModal(false)
  try {
    dispatch(deleteStart())
    const res = await axios.delete(`/api/user/delete/${currentUser._id}`)
    if(res.status == 200){
      dispatch(deleteSuccess(resizeBy))
    }else{
      dispatch(deleteFailure("Can't dlete the user, Something went wrong!"))
    }
  } catch (error) {
    dispatch(deleteFailure(error.message))
  }
}

const handleSignout = async()=> {
 
try {
  const res = await axios.post('/api/user/signout')
  console.log(res);
  if(res.status == 200){
    dispatch(signoutSuccess())
  }else{
    console.log(res.message);
  }


} catch (error) {
  console.log(error.message);
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
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline disabled={loading || imageFileUploading}>
          {loading ? 'loading...' : 'Update'}
        </Button>

        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
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
      {error && (
        <Alert color={"failure"} className="mt-5">
          {error}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure You want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDelete}>
                {" "}
                Yes, I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default DashProfile;
