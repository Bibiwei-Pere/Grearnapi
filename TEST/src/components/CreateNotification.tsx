import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../apiRequests/apirequest";
import UseAuth from "../hooks/UseAuth";

const CreateNotification = () => {
	const { auth }: any = UseAuth();
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [author, setAuthor] = useState("");

	const setForm = async () => {
		const form = {
			id: auth.id,
			title: title,
			text: text,
			author: author,
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

			const res = await Notification(isMounted, form, controller, auth, "post");
			console.log(res?.data);
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
			<h1>Create Notifications</h1>
			<input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
			<input type="text" placeholder="Text" onChange={(e) => setText(e.target.value)} />
			<input type="text" placeholder="Author" onChange={(e) => setAuthor(e.target.value)} />
			<button>Proceed</button>
			{error && <span>{error}</span>}
		</form>
	);
};

export default CreateNotification;
