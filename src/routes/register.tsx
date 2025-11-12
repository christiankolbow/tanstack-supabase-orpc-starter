import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="space-y-4">
				<RegisterForm />
				<div className="text-center text-sm">
					<Link to="/login" className="underline">
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
