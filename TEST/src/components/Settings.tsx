import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, apiRequest } from "../apiRequests/apirequest";
import UseAuth from "../hooks/UseAuth";

const Settings = () => {
	const { auth }: any = UseAuth();
	const [users, setUsers] = useState<any[]>([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [country, setCountry] = useState("");
	const [dob, setDob] = useState("");
	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState("");

	const setForm = async () => {
		const form = {
			id: auth.id,
			firstname: firstname,
			lastname: lastname,
			username: username,
			phone: phone,
			email: email,
			password: password,
			country: country,
			dob: dob,
			avatar: avatar,
		};
		return form;
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		User(isMounted, setUsers, controller, auth, "get");

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [auth.id]);

	// To make a get request to the users API with jsonwebtokens
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");

		try {
			let isMounted = true;
			const controller = new AbortController();
			const form = await setForm();

			const res = await User(isMounted, form, controller, auth, "patch");
			if (res?.status === 200) {
				isMounted = false;
				controller.abort();
				navigate("/dashboard/user");
			} else setError(res?.data.message);
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpload = async () => {
		try {
			setLoading(true);
			const data = new FormData();
			data.append("my_file", file);
			const res = await apiRequest.post("/upload", data);
			setAvatar(res.data.secure_url);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	console.log(avatar);
	return (
		<div>
			<h1>Settings</h1>
			<br />
			<div className="image">
				<input className="file" type="file" onChange={(e: any) => setFile(e.target.files[0])} multiple={false} />
				{file && (
					<button onClick={handleUpload} className="btn-green">
						{loading ? "uploading..." : avatar ? "Upload Succesfully" : "Upload image"}
					</button>
				)}
			</div>
			<br />
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder={users ? users[0]?.firstname : "Firstname"} onChange={(e) => setFirstname(e.target.value)} />
				<input type="text" placeholder={users ? users[0]?.lastname : "Lastname"} onChange={(e) => setLastname(e.target.value)} />
				<input type="text" placeholder={users ? users[0]?.username : "Username"} onChange={(e) => setUsername(e.target.value)} />
				<input type="text" placeholder={users ? users[0]?.country : "Country code"} onChange={(e) => setCountry(e.target.value)} />
				<input type="number" placeholder={users ? users[0]?.phone : "Phone number"} onChange={(e) => setPhone(e.target.value)} />
				<input type="email" placeholder={users ? users[0]?.email : "Email"} onChange={(e) => setEmail(e.target.value)} />
				<input type="text" placeholder="****" onChange={(e) => setPassword(e.target.value)} />
				<input type="text" placeholder={users ? users[0]?.dob : "Date of birth"} onChange={(e) => setDob(e.target.value)} />
				<button>Proceed</button>
				{error && <span>{error}</span>}
			</form>
		</div>
	);
};

export default Settings;
