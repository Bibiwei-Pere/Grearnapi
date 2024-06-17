import { Link } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";
import { useEffect, useState } from "react";
import { User } from "../apiRequests/apirequest";

const Dashboard = () => {
	const { auth, setAuth }: any = UseAuth();
	const [users, setUsers] = useState<any[]>([]);

	const handleLogout = async (e: any) => {
		e.preventDefault();
		setAuth({});
	};

	// To make a get request to the users API with jsonwebtokens
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		User(isMounted, setUsers, controller, auth, "get");

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [auth.email]);
	return (
		<div className="home">
			<h1>Welcome to GREARN Dashboard</h1>
			<div>
				<h2>Profile Details</h2>
				<br />

				{users.length > 0 ? (
					<ul>
						<li>
							Avatar: <img src={users[0].avatar} alt="" />
						</li>
						<li>
							Firstname: <b> {users[0].firstname} </b>
						</li>
						<li>
							Lastname: <b> {users[0].lastname} </b>
						</li>
						<li>
							Phone: <b> {users[0].phone} </b>
						</li>
						<li>
							Username: <b> {users[0].username} </b>
						</li>
						<li>
							Email: <b> {users[0].email} </b>
						</li>
						<li>
							Username: <b> {users[0].username} </b>
						</li>
					</ul>
				) : (
					<p>No user found</p>
				)}
			</div>
			<button onClick={handleLogout}>Logout</button>
			<ul>
				<li>
					<Link to="/admin">Admin Portal</Link>
				</li>
				<li>
					<Link to="/dashboard/user">User Profile</Link>
				</li>
			</ul>
		</div>
	);
};

export default Dashboard;
