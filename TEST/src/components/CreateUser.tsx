import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../apiRequests/apirequest";
import UseAuth from "../hooks/UseAuth";

const CreateUser = () => {
	const { auth }: any = UseAuth();
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cpassword, setCPassword] = useState("");
	const [country, setCountry] = useState("");
	const [dob, setDob] = useState("");

	const setForm = async () => {
		const form = {
			id: auth.id,
			firstname: firstname,
			lastname: lastname,
			username: username,
			phone: phone,
			email: email,
			password: password,
			cpassword: cpassword,
			country: country,
			dob: dob,
		};
		return form;
	};

	// To make a get request to the users API with jsonwebtokens
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");

		try {
			let isMounted = true;
			const controller = new AbortController();
			const form = await setForm();

			const res = await User(isMounted, form, controller, auth, "post");
			console.log(res);
			if (res?.status === 200) {
				isMounted = false;
				controller.abort();
				navigate("/admin");
			} else setError(res?.data.message);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Create Users</h1>
			<input type="text" placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} />
			<input type="text" placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} />
			<input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
			<input type="text" placeholder="Country code" onChange={(e) => setCountry(e.target.value)} />
			<input type="number" placeholder="Phone number" onChange={(e) => setPhone(e.target.value)} />
			<input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
			<input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
			<input type="text" placeholder="Comfirm password" onChange={(e) => setCPassword(e.target.value)} />
			<input type="text" placeholder="Date of birth" onChange={(e) => setDob(e.target.value)} />
			<select multiple={true} size={2}>
				<option value="User">User</option>
				<option value="Admin">Admin</option>
			</select>
			<button>Proceed</button>
			{error && <span>{error}</span>}
		</form>
	);
};

export default CreateUser;
