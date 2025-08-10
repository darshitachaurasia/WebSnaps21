import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [tasks, setTasks] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // If same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Move task to new status
    setTasks((prev) =>
      prev.map((task) =>
        String(task.id) === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
  };

  const columns = {
    "To do": tasks.filter((t) => t.status === "To do"),
    "Doing": tasks.filter((t) => t.status === "Doing"),
    "Done": tasks.filter((t) => t.status === "Done"),
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Board</h1>
      <TaskForm addTask={setTasks} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {Object.keys(columns).map((colId) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "6px",
                    minHeight: "200px",
                  }}
                >
                  <h3>{colId}</h3>
                  {columns[colId].map((task, index) => (
                    <Draggable
                      draggableId={String(task.id)} // must be string
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          style={{
                            padding: "8px",
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {task.task} ({task.tags.join(", ")})
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
