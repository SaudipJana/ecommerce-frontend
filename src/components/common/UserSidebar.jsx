import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const {logout} = useContext(AuthContext);

    return (
        <div className="card shadow sidebar mb-5">
            <div className="card-body p-4">
                <ul>
                    <li><Link to="/profile">Account</Link></li>
                    <li><a href="/orders">Orders</a></li>
                    <li><a href="">Change Password</a></li>
                    <li><a href="" onClick={logout}>Logout</a></li>
                </ul>
            </div>
        </div>
    )
}
export default Sidebar