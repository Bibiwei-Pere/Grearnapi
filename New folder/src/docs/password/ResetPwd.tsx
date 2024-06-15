import { useState } from "react";
import { apiRequest } from "../../apiRequests/apirequest";
import { useNavigate, useParams } from "react-router-dom";

const ResetPwd = () => {
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { id, token } = useParams();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");

		const formData = new FormData(e.target);
		const code = formData.get("code");
		const password = formData.get("password");
		const cpassword = formData.get("cpassword");

		try {
			const res = await apiRequest.post(`/pwd/reset-password/${id}/${token}`, {
				code,
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
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Reset Password</h1>
				<input name="password" type="password" placeholder="Password" />
				<input name="cpassword" type="password" placeholder="Comfirm Password" />
				<input name="code" type="text" placeholder="Enter Verification Code" />
				<button>Reset Password</button>
				{error && <span>{error}</span>}
			</form>
		</div>
	);
};

export default ResetPwd;
