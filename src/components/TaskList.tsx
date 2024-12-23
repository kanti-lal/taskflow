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

interface TaskListProps {
  tasks: Task[];
  onTasksReorder: (tasks: Task[]) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  onTasksReorder,
  onStatusChange,
  onDelete,
}: TaskListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
            onStatusChange={onStatusChange}
            onDelete={onDelete}
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
  ...props
}: {
  task: Task;
  index: number;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
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
      <TaskItem task={task} {...props} />
    </div>
  );
}
