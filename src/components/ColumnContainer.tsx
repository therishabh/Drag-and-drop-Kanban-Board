import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumnTitle,
    createTask,
    tasks,
    deleteTask,
    updateTaskContent,
  } = props;
  const [editMode, setEditMode] = useState(false);

  const taskId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      w-[350px]
      h-[500px]
      opacity-40
      border-2
      border-rose-500
      max-h-[500px]
      rounded-md
      flex
      flex-col
  "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
    "
    >
      <div
        {...attributes}
        {...listeners}
        className="
            bg-mainBackgroundColor
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-columnBackgroundColor
            border-4
            flex
            justify-between
            items-center
            "
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          <div onClick={() => setEditMode(true)}>
            {editMode ? (
              <input
                className="bg-transparent border border-blue-400 pl-2 h-8 rounded-md font-normal text-base"
                type="text"
                autoFocus
                onBlur={() => setEditMode(false)}
                value={column.title}
                onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              />
            ) : (
              column.title
            )}
          </div>
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor px-1 py-1 rounded-full"
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-2 p-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTaskContent={updateTaskContent}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => createTask(column.id)}
        className="flex gap-2 items-center border-mainBackgroundColor bg-mainBackgroundColor border-2 border-r-0 border-l-0 round p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
