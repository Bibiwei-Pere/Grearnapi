import { useState } from "react";
import { apiRequest } from "../../apiRequests/apirequest";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");

		const formData = new FormData(e.target);
		const firstname = formData.get("firstname");
		const lastname = formData.get("lastname");
		const username = formData.get("username");
		const phone = formData.get("phone");
		const email = formData.get("email");
		const password = formData.get("password");
		const cpassword = formData.get("cpassword");

		try {
			const res = await apiRequest.post("/auth/signup", {
				firstname,
				lastname,
				username,
				phone,
				email,
				password,
				cpassword,
			});
			if (res.status === 200) {
				navigate("/signin");
			} else setError(res.data.message);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Get Started</h1>
			<input name="firstname" type="text" placeholder="Firstname" />
			<input name="lastname" type="text" placeholder="Lastname" />
			<input name="username" type="text" placeholder="Username" />
			<input name="phone" type="number" placeholder="Phone" />
			<input name="email" type="email" placeholder="Email" />
			<input name="password" type="password" placeholder="Password" />
			<input name="cpassword" type="password" placeholder="Comfirm password" />
			<button>Login</button>
			{error && <span>{error}</span>}
			<p>
				Already have an account?
				<b>
					<a href="/signin">Sign in</a>
				</b>
			</p>
		</form>
	);
};

export default Signup;
