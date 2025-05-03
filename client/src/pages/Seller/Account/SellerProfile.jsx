import { useAuth } from "../../../context/AuthContext";
export default function SellerProfile() {
    const { user } = useAuth();

    return(
        <div><h1 className="text-black text-3xl">hola {user.profile.username}</h1></div>
    )
};