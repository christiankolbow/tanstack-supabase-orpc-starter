import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { logoutFn } from "@/lib/auth/server";

export function LogoutButton() {
	const router = useRouter();
	const logoutServer = useServerFn(logoutFn);
	const mutation = useMutation({
		mutationFn: () => logoutServer(),
		onSuccess: async (res) => {
			if (!res?.error) {
				await router.invalidate();
				router.navigate({ to: "/login" });
			}
		},
	});
	return (
		<Button
			variant="outline"
			onClick={() => mutation.mutate()}
			disabled={mutation.isPending}
		>
			Logout
		</Button>
	);
}
