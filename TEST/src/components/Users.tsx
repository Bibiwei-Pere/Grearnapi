import { useState, useEffect } from "react";
import { User } from "../apiRequests/apirequest";
import UseAuth from "../hooks/UseAuth";
import { Link } from "react-router-dom";

const Users = () => {
	const [users, setUsers] = useState<any[]>([]);
	const { auth }: any = UseAuth();

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
		<div>
			<h2>Profile Details</h2>
			<br />

			{users.length > 0 ? (
				<ul>
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
						Email: <b> {users[0].email} </b>
					</li>
					<li>
						Username: <b> {users[0].username} </b>
					</li>
				</ul>
			) : (
				<p>No user found</p>
			)}
			<br />
			<Link to="/dashboard/settings">
				<button>Edit profile</button>
			</Link>
			<br />
		</div>
	);
};

export default Users;
