import { useState } from "react";
import { apiRequest } from "../apiRequests/apirequest";

const Upload = () => {
	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState("");
	const handleSelectFile = (e: any) => setFile(e.target.files[0]);

	const handleUpload = async () => {
		try {
			setLoading(true);
			const data = new FormData();
			data.append("my_file", file);
			const res = await apiRequest.post("/upload", data);
			setRes(res.data.secure_url);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<input className="file" type="file" onChange={handleSelectFile} multiple={false} />
			<div>Response: {res}</div>
			{file && (
				<>
					<button onClick={handleUpload} className="btn-green">
						{loading ? "uploading..." : res ? "Upload Succesfully" : "Upload image"}
					</button>
				</>
			)}
		</div>
	);
};

export default Upload;
