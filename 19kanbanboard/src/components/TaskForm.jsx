import React, { useState } from 'react';
import Tag from './Tag';

function TaskForm({ addTask }) {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("To do");
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "task") {
      setTask(value);
    } else if (name === "status") {
      setStatus(value);
    }
  };

  const checkTag = (tag) => tags.includes(tag);

  const selectTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((item) => item !== tag));
    } else {
      setTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      task,
      status,
      tags
    };

    addTask((prev) => [...prev, newTask]);
    setTask("");
    setStatus("To do");
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="task"
        value={task}
        placeholder="Enter your task..."
        onChange={handleChange}
      />

      <div>
        <Tag tagName="DSA" selectTag={selectTag} selected={checkTag("DSA")} />
        <Tag tagName="WebD" selectTag={selectTag} selected={checkTag("WebD")} />
        <Tag tagName="Reasoning" selectTag={selectTag} selected={checkTag("Reasoning")} />
        <Tag tagName="Current Affairs" selectTag={selectTag} selected={checkTag("Current Affairs")} />
      </div>

      <select name="status" value={status} onChange={handleChange}>
        <option value="To do">To do</option>
        <option value="Doing">Doing</option>
        <option value="Done">Done</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
