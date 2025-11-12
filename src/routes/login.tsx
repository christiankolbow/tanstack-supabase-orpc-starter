import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="space-y-4">
				<LoginForm />
				<div className="text-center text-sm">
					<Link to="/register" className="underline">
						Create account
					</Link>
					<span className="mx-2">•</span>
					<Link to="/recover" className="underline">
						Forgot password?
					</Link>
				</div>
			</div>
		</div>
	);
}
