import { Link } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";

const Dashboard = () => {
	const { setAuth }: any = UseAuth();

	const handleLogout = async (e: any) => {
		e.preventDefault();
		setAuth({});
	};
	return (
		<div className="home">
			<h1>Welcome to GREARN Dashboard</h1>

			<button onClick={handleLogout}>Logout</button>
			<ul>
				<li>
					<Link to="/admin">Admin Portal</Link>
				</li>
				<li>
					<Link to="/user">User Profile</Link>
				</li>
			</ul>
		</div>
	);
};

export default Dashboard;
