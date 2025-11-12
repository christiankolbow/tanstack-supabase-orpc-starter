import { createFileRoute, Link } from "@tanstack/react-router";
import { RecoverForm } from "@/components/auth/RecoverForm";

export const Route = createFileRoute("/recover")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="space-y-4">
				<RecoverForm />
				<div className="text-center text-sm">
					<Link to="/login" className="underline">
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
