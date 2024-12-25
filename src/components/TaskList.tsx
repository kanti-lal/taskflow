import { useEffect, useRef } from "react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { TaskItem } from "./TaskItem";
import { Task } from "../types";
import confetti from "canvas-confetti";

interface TaskListProps {
  tasks: Task[];
  onTasksReorder: (tasks: Task[]) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
}

// Add the confetti function outside the component
const triggerConfetti = () => {
  const defaults = {
    origin: { y: 0.9 },
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(200 * particleRatio),
    });
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export function TaskList({
  tasks,
  onTasksReorder,
  onStatusChange,
  onDelete,
}: TaskListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasShownConfetti = useRef(false);

  // Wrap the onStatusChange to add confetti logic
  const handleStatusChange = (id: string, status: Task["status"]) => {
    // First call the original handler
    onStatusChange(id, status);

    // Check if this change would complete all tasks
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );

    if (
      !hasShownConfetti.current &&
      status === "completed" &&
      updatedTasks.length > 0 &&
      updatedTasks.every((task) => task.status === "completed")
    ) {
      triggerConfetti();
      hasShownConfetti.current = true;
    } else if (!updatedTasks.every((task) => task.status === "completed")) {
      hasShownConfetti.current = false;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = combine(
      dropTargetForElements({
        element: containerRef.current,
        getData: ({ input }) => {
          return attachClosestEdge(
            {},
            {
              element: containerRef.current!,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
      }),
      monitorForElements({
        onDrop: ({ location, source }: any) => {
          const sourceIndex = Number(source.data.index);
          const target = location.current.dropTargets[0];

          if (!target) return;

          const targetData = target.data;
          const closestEdge = extractClosestEdge(targetData);

          if (!location.current.index && location.current.index !== 0) {
            if (closestEdge === "top") {
              onTasksReorder(
                reorder({
                  list: tasks,
                  startIndex: sourceIndex,
                  finishIndex: 0,
                })
              );
              return;
            }
            onTasksReorder(
              reorder({
                list: tasks,
                startIndex: sourceIndex,
                finishIndex: tasks.length - 1,
              })
            );
            return;
          }

          const destinationIndex = getReorderDestinationIndex({
            startIndex: sourceIndex,
            indexOfTarget: location.current.index,
            closestEdgeOfTarget: closestEdge,
            axis: "vertical",
          });

          onTasksReorder(
            reorder({
              list: tasks,
              startIndex: sourceIndex,
              finishIndex: destinationIndex >= 0 ? destinationIndex : 0,
            })
          );
        },
      })
    );

    return cleanup;
  }, [tasks, onTasksReorder]);

  return (
    <div ref={containerRef} className="">
      {tasks.map((task, index) => (
        <div key={task.id} className="py-2">
          <DraggableTaskItem
            task={task}
            index={index}
            onStatusChange={handleStatusChange}
            onDelete={onDelete}
            indexNumber={index}
          />
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No tasks yet. Add your first task above!
        </div>
      )}
    </div>
  );
}

function DraggableTaskItem({
  task,
  index,
  indexNumber,
  ...props
}: {
  task: Task;
  index: number;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
  indexNumber: any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = draggable({
      element: ref.current,
      getInitialData: () => ({
        id: task.id,
        index,
        type: "task-item",
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }: any) => {
        if (!ref.current) return;
        nativeSetDragImage(ref.current, 10, 10);
      },
    });

    return cleanup;
  }, [task.id, index]);

  return (
    <div
      ref={ref}
      className="cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 rounded-lg shadow-sm 
        hover:shadow-md transition-all duration-200 
        active:shadow-lg active:scale-[1.02]"
    >
      <TaskItem task={task} {...props} indexNumber={indexNumber} />
    </div>
  );
}
