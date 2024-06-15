import { useState } from "react";
import { apiRequest } from "../../apiRequests/apirequest";
import { useLocation, useNavigate } from "react-router-dom";
import UseAuth from "../../hooks/UseAuth";

const Login = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { setAuth }: any = UseAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/dashboard";

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.target);
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			const res = await apiRequest.post(`/auth/signin`, {
				email,
				password,
			});
			if (res.status === 200) {
				const accessToken = res?.data?.accessToken;
				const roles = res?.data?.roles;
				setAuth({ email, password, roles, accessToken });
				navigate(from, { replace: true });
			} else setError(res.data.message);
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Login Page</h1>
			<input name="email" type="email" placeholder="Enter your email" />
			<input name="password" type="password" placeholder="Password" />
			<button disabled={isLoading}>Login</button>
			{error && <span>{error}</span>}
			<p>
				Don't have an account yet?
				<b>
					<a href="/signup">Sign up</a>
				</b>
			</p>
		</form>
	);
};

export default Login;
