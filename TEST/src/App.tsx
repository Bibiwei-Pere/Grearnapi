import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ForgotPwd from "./docs/password/ForgotPwd";
import ResetPwd from "./docs/password/ResetPwd";
import Login from "./docs/auth/Login";
import Signup from "./docs/auth/Signup";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./hooks/RequireAuth";
import Admin from "./components/Admin";
import Users from "./components/Users";
import Settings from "./components/Settings";
import CreateUser from "./components/CreateUser";
import CreateNotification from "./components/CreateNotification";
import Upload from "./components/Upload";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/forgot-password" element={<ForgotPwd />} />
				<Route path="/reset-password/:id/:token" element={<ResetPwd />} />
				<Route path="/unauthorize" element={<h1>Unauthorize, Pls Go back</h1>} />

				{/* Protected Routes */}
				<Route element={<RequireAuth allowedRoles={["User"]} />}>
					<Route path="dashboard" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="user" element={<Users />} />
						<Route path="settings" element={<Settings />} />
						<Route path="upload" element={<Upload />} />
					</Route>
				</Route>
				<Route element={<RequireAuth allowedRoles={["Admin"]} />}>
					<Route path="admin" element={<Layout />}>
						<Route index element={<Admin />} />
						<Route path="create" element={<CreateUser />} />
						<Route path="notification" element={<CreateNotification />} />
					</Route>
				</Route>
				{/* End Protected Routes */}
				<Route path="*" element={<h1>404, Go Back</h1>} />
			</Route>
		</Routes>
	);
};

export default App;

const Layout = () => {
	return <Outlet />;
};
