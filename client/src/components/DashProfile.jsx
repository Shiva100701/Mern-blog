import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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


function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [
    firebaseImageFielUploadingProgress,
    setFirebaseImageFielUploadingProgress,
  ] = useState(null);
  const [firebaseImageFielUploadingError, setFirebaseImageFielUploadingError] =
    useState(null);
  const fileRef = useRef();

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
          {firebaseImageFielUploadingProgress && (<CircularProgressbar value={firebaseImageFielUploadingProgress || 0} text={`${firebaseImageFielUploadingProgress}%`}
          strokeWidth={5}
          styles={{
            root:{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            },
            path: {
              stroke: `rgba(62, 152, 199, ${firebaseImageFielUploadingProgress/100})`
            }
          }}
          />)}
          <img
            src={imageFileUrl || currentUser.photoUrl}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${firebaseImageFielUploadingProgress && firebaseImageFielUploadingProgress <100 && 'opacity-60' }`}
          />
        </div>
        {firebaseImageFielUploadingError && <Alert color = 'failure'>
          {firebaseImageFielUploadingError}
          </Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default DashProfile;
