import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFn } from "@/lib/auth/server";

export function LoginForm() {
	const router = useRouter();
	const loginServer = useServerFn(loginFn);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const mutation = useMutation({
		mutationFn: () => loginServer({ data: { email, password } }),
		onSuccess: async (res) => {
			if (!res?.error) {
				await router.invalidate();
				router.navigate({ to: "/" });
			}
		},
	});
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{mutation.data?.error && (
					<p className="text-sm text-red-500">{mutation.data.message}</p>
				)}
			</CardContent>
			<CardFooter className="flex w-full gap-2">
				<Button
					className="w-full"
					disabled={mutation.isPending}
					onClick={() => mutation.mutate()}
				>
					Login
				</Button>
			</CardFooter>
		</Card>
	);
}
