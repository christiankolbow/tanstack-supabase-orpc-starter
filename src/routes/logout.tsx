import { createFileRoute } from "@tanstack/react-router";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const Route = createFileRoute("/logout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<LogoutButton />
		</div>
	);
}
