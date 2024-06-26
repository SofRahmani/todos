import { baseAuth } from "@/auth/auth";
import TasksDashboard from "@/components/dashboard/TasksDashboard";
import TaskCard from "@/components/taskcard/TaskCard";
import { prisma } from "@/prisma";

export default async function Home() {
  const session = await baseAuth();

  if (!session?.user) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="text-4xl">Vous devez être connecté pour accéder à cette page.</h1>
      </main>
    );
  }

  const task = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      completed: false
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return (
    <main className="flex h-screen w-full flex-row items-start justify-start">
      <TasksDashboard title="Mes tâches">
        {task.length === 0 && (
          <div className='size-full'>
            <h1 className=" text-2xl">
              Aucune tâche à afficher.
            </h1>
          </div>
        )}
        {task.map(task => (
          <TaskCard
            key={task.id}
            completeStatus={task.completed}
            priorityStatus={task.priority}
            title={task.title}
            description={task.information}
            id={task.id}
            dueDate={task.dueDate!}
          />
        ))}
        
      </TasksDashboard>
    </main>
  );
}
