import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { todosQuery } from "@/integrations/tanstack-query/todos/queries";
import { client } from "@/orpc/client";
import type { TTodoStatus } from "@/orpc/schema";

export const Route = createFileRoute("/_protected/todoSsr")({
	loader: ({ context }) => context.queryClient.ensureQueryData(todosQuery),
	component: TodoPageSsr,
});

function TodoPageSsr() {
	const qc = useQueryClient();
	const [newTodo, setNewTodo] = React.useState("");
	const { data } = useSuspenseQuery(todosQuery);

	const createMutation = useMutation({
		mutationFn: () => client.createTodo({ todo: newTodo }),
		onSuccess: () => {
			setNewTodo("");
			qc.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Todos (SSR first)</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<form
						className="flex gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							if (newTodo.trim().length === 0) return;
							createMutation.mutate();
						}}
					>
						<Input
							placeholder="Add a todo..."
							value={newTodo}
							onChange={(e) => setNewTodo(e.target.value)}
						/>
						<Button type="submit" disabled={createMutation.isPending}>
							Add
						</Button>
					</form>

					<ul className="space-y-2">
						{data?.map((t) => (
							<TodoItem key={t.id} todo={t} />
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}

function TodoItem({
	todo,
}: {
	todo: {
		id: number;
		todo: string;
		status: "open" | "in_progress" | "completed";
	};
}) {
	const qc = useQueryClient();
	const [name, setName] = React.useState(todo.todo);

	const updateMutation = useMutation({
		mutationFn: () => client.updateTodo({ id: todo.id, todo: name }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
	});

	const statusMutation = useMutation({
		mutationFn: (status: "open" | "in_progress" | "completed") =>
			client.updateTodoStatus({ id: todo.id, status }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
	});

	const deleteMutation = useMutation({
		mutationFn: () => client.deleteTodo({ id: todo.id }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
	});

	return (
		<li className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
			<Input value={name} onChange={(e) => setName(e.target.value)} />
			<select
				className="border rounded px-2 py-2 h-10"
				value={todo.status}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					statusMutation.mutate(e.currentTarget.value as TTodoStatus)
				}
			>
				<option value="open">open</option>
				<option value="in_progress">in_progress</option>
				<option value="completed">completed</option>
			</select>
			<Button
				variant="secondary"
				onClick={() => updateMutation.mutate()}
				disabled={updateMutation.isPending}
			>
				Save
			</Button>
			<Button
				variant="destructive"
				onClick={() => deleteMutation.mutate()}
				disabled={deleteMutation.isPending}
			>
				Delete
			</Button>
		</li>
	);
}
