import UseAuth from "./UseAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }: any) => {
	const { auth }: any = UseAuth();
	const location = useLocation();
	return auth?.roles?.find((role: any) => allowedRoles?.includes(role)) ? <Outlet /> : auth?.email ? <Navigate to="/unauthorize" state={{ from: location }} replace /> : <Navigate to="/signin" state={{ from: location }} replace />;
};

export default RequireAuth;
