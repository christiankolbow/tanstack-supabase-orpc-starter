import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data, error: _error } = await supabase.auth.getUser();

	if (!data.user?.email) {
		return null;
	}

	return {
		email: data.user.email,
	};
});

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ location }) => {
		const user = await fetchUser();
		if (!user)
			throw redirect({ to: "/login", search: { redirectUrl: location.href } });
		return { user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<h1 className="py-12 font-bold text-4xl text-center">Protected Route</h1>
			<Outlet />
		</div>
	);
}
