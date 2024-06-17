import { useState, useEffect, Key } from "react";
import { getAllUsers } from "../apiRequests/apirequest";
import { Link } from "react-router-dom";

const Admin = () => {
	const [users, setUsers] = useState<any[]>([]);

	// To make a get request to the users API with jsonwebtokens
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController(); // Cancel any pending request if user logouts
		getAllUsers(isMounted, setUsers, controller);

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<>
			<h1>Admins Page</h1>
			<div>
				<h2>Total Users List</h2>
				<br />

				{users ? (
					<table>
						<thead>
							<tr>
								<th>Firstname</th> <th>Lastname</th> <th>Phone</th> <th>Email</th> <th>Username</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user: any, i: Key) => (
								<tr key={i}>
									<td>{user.firstname}</td> <td>{user.lastname}</td> <td>{user.phone}</td> <td>{user.email}</td> <td>{user.username}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No users to display</p>
				)}
				<br />
				<Link to="/admin/create">
					<button>Create profile</button>
				</Link>
				<br />
				<br />
				<Link to="/admin/notification">
					<button>Create Notification</button>
				</Link>
			</div>
		</>
	);
};

export default Admin;
