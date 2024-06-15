import { useState } from "react";
import { apiRequest } from "../../apiRequests/apirequest";
import { useNavigate } from "react-router-dom";

const ForgotPwd = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.target);
		const email = formData.get("email");

		try {
			const res = await apiRequest.post("/pwd/forgot-password", { email });
			if (res.status === 200) {
				navigate(`/reset-password/${res.data.id}/${res.data.token}`);
			} else {
				console.log(res.data.message);
				setError(res.data.message);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Forgot Password</h1>
				<input name="email" type="text" placeholder="Email" />
				<button disabled={isLoading}>Forgot Password</button>
				{error && <span>{error}</span>}
			</form>
		</div>
	);
};

export default ForgotPwd;
