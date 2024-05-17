import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    photoUrl: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8aGhoAAADAwMAXFxcVFRURERH7+/sKCgoJCQkSEhL29vasrKxubm4ODg47OzvNzc3j4+ONjY3V1dVISEgiIiKfn5+ysrLw8PBbW1tWVlYuLi58fHylpaW6urrp6emVlZWGhoZmZmY4ODhOTk4oKCh9fX1CQkKGnoe6AAAEn0lEQVR4nO3d2XaiQBAG4NjSCiKIUSRu0biM7/+GAzFOchS1uhumunL+72rmrv7TsvRC5eUFAAAAAAAAAAAAAAAAAAAAAAAAoFY8zrrdbjaOuQtpRbZdpOoiXWwz7oKalSVVrKBzEVRhk98TcpirqHMrUvmQu7RGFKnSNfkqWqUFd3nOxiMV3Mn3+XNVozF3iW5mqvcgX6WnZtxFupirJ/kqas5dprV4TwlYRtwLfUDGeUgK2OmE+Rt3sTb6eUoM2OmkeZ+7XAsj6gh+juKIu1xzCe0avFAJd8GmCrOAZURhz/4304BlRFl3m7nJRXgWinosZuZDWA6ipLnGaGCRcCDofmo1hKIGcUF/1v+ULrgLp9rYDWE5iBvu0olm1gmlTKRONveZyuDEXTpNbDuE5SDKmEZ1HRJ2uYsn2Tok3HIXT7Izf2O7CHfcxZMs7y0ePqeX3MWTPFw+fCxQ3MVT9O0vw/JClLCa8fsTOjwOhTwQf/8Yvjgl5C6eJLe/l+qcu3iS6bPNmPt6U+7iSVZ126E00R/u4kmGDu+lMjaFJw4JJ9zF01i/tsl4aSslthditOIunch6CixnOTGy+5kGEXfhZJazfCEz/Irly7eI1+4vr1Y7M6/cZRvoWzwwAhnzigvjLWB5m8AL02diJGZb5kt897hePS3pNnNm+HYq5Y30J6NLUdpFeLamRxSzrXaFHFGtuUu19U663Wj1zl2ovbF+PoxKyz4lnDwZRi3vQNu17Pggo1ZHMVPCB4b6zmHvntIyVp6ee5+qm5A9paaC7zA3NutF9TVQmA70IA2rfy7WUg7P0E2K12R+Gp3myWsh8B0NAAAAAAAAAACE2GTF7GOV7Ha7ZPUxK7JftdI2Hq72595CURimYRid/7NfDWXvWJzFxa5KVrewr6uku0LWJ9xX+sVBqfBhf5pQqUMh6pjJD5Pkdi2/fvtCJRJXiLun2uZQ9SJ1kvFd3rfukjR83wZqKSnj5GR4mqai1UnKbzVODMfvexwTEceG3pXDSXYBhxb6O4fPD6sDinPPHx2TnstXT5Wo5/XVuLa4w1zTPp8fWrkO4Jm/B1AOzQQsIx64o9TqE/vPkSLuPbzfxEv7z/BvhUfvnoz9RgOWEZe+jeLI/qPDepFnPZUWzV2DF8qro+0NPSauInr0JZvDV6MPI3pzrm/cTsAyoi8rVYH7q1o93eGOdmbY5dKEH+9vDk2TCBF9WNpwmg8+48O3zx9tDmE5iOw9CFq7j/6LyH0/tWyRSMfdTNGyy6UJ5k/YHfqYUPH2O3FogUHH+mnivO2rsJIyNhi26Phsg7FLdEtzipuEfHOMpNmVi3tCvrdThw6JJvSeLeH/+ZFy9jhDQvkJgzYnTt+CgC3hof13tkqPbxvDqg2NOcbGNf9hZvGZkHF20eoKxgXrSoZDY2s61qYZNt2STDF3V7LolmSKu7EL6S+rOQVk//Mzx3YnwemRO+BLnDe9N/pTlHuw292ftrhvMfVjr3trcJLURORPI8UN8TSwierksE/n+d9mB9Wsw8y/I+6ff7C5GRn3ZgUAAAAAAAAAAAAAAAAAAAAAAAAw+QtU4DyhLeYkmAAAAABJRU5ErkJggg==",
    }
}, {
    timestamps: true
}
);


const User = mongoose.model("User", userSchema)

export default User;