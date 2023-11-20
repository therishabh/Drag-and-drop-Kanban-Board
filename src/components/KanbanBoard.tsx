import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import { generateId } from "../utils";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag functionality will start when user will drag 5px in any direction
      },
    })
  );

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filterColumns = columns.filter((col) => col.id != id);
    setColumns([...filterColumns]);

    const updatedTasks = tasks.filter(task => task.columnId != id);
    setTasks(updatedTasks);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      const activeCol = event.active.data.current?.column;
      setActiveColumn(activeCol);
      return;
    }
    if(event.active.data.current?.type === "Task") {
      const activeTsk = event.active.data.current?.task;
      setActiveTask(activeTsk);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { over, active } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (val) => val.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (val) => val.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const updateColumnTitle = (id: Id, title: string) => {
    const updatedColumns = columns.map((column) => {
      return column.id == id ? { ...column, title } : column;
    });
    setColumns(updatedColumns);
  };

  const createTask = (columnId: Id) => {
    const newtask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newtask]);
  };

  const deleteTask = (taskId : Id) => {
    const updatedTask = tasks.filter(val => val.id !== taskId);
    setTasks(updatedTask);
  }

  const updateTaskContent = (taskId : Id, content: string) => {
    const updatedTasks = tasks.map((task) => {
      return task.id == taskId ? { ...task, content } : task;
    });
    setTasks(updatedTasks);
  }

  const onDragOver = (event : DragOverEvent) => {
    const { over, active } = event;
    console.log('over', over);
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;
    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if(!isActiveTask) return

    if(isActiveTask && isOverTask){
      setTasks(tasks => {
        const activeTaskIndex = tasks.findIndex(
          (val) => val.id === activeTaskId
        );
        const overTaskIndex = tasks.findIndex(
          (val) => val.id === overTaskId
        );
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      })
    }

    const isOverColumn = over.data.current?.type === 'Column';
    if(isOverColumn && isActiveTask){
      setTasks(tasks => {
        const activeTaskIndex = tasks.findIndex(
          (val) => val.id === activeTaskId
        );
        tasks[activeTaskIndex].columnId = overTaskId;
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      })
    }
  }

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center 
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div
          className="
            m-auto
            flex gap-4
        "
        >
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumnTitle={updateColumnTitle}
                  createTask={createTask}
                  tasks={tasks.filter(val => val.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTaskContent={updateTaskContent}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="
            h-[60px] 
            w-[350px] 
            min-w-[350px] 
            cursor-pointer 
            rounded-lg 
            bg-mainBackgroundColor border-2 
            border-columnBackgroundColor p-4 
            ring-rose-500 
            hover:ring-2
            flex
            gap-2
            "
            onClick={() => createNewColumn()}
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumnTitle={updateColumnTitle}
                createTask={createTask}
                tasks={tasks.filter(val => val.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTaskContent={updateTaskContent}

                />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteColumn} updateTaskContent={updateTaskContent} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
