import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTaskContent }: Props) => {
  const [mouseHover, setMouseHover] = useState(false);
  const [editable, setEditable] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editable,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if(isDragging){
    return (
        <div ref={setNodeRef}
        style={style} className=" bg-mainBackgroundColor
        text-sm
        border-2
        border-rose-500
        opacity-40
        cursor-grab
        rounded-lg
        flex
        justify-between
        items-center
        p-3 min-h-[56px]"></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setEditable(true)}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className=" bg-mainBackgroundColor
          text-sm
          cursor-grab
          rounded-lg
          flex
          justify-between
          items-center
          p-3 min-h-[56px]"
    >
      {editable && (
        <textarea
          className="bg-transparent border resize-none border-blue-400 pl-2 rounded-md font-normal text-base"
          autoFocus
          value={task.content}
          onBlur={() => setEditable(false)}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setEditable(false);
          }}
        >
          {task.content}
        </textarea>
      )}
      {!editable && task.content}
      {mouseHover && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor px-1 py-1 rounded-full"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
