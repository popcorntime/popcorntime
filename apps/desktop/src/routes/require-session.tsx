import { Navigate, Outlet } from "react-router";
import { useGlobalStore } from "@/stores/global";

export function RequireSession() {
	const isActive = useGlobalStore(s => s.session.isActive);

	if (!isActive) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
