import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTask,
          completed: false,
        }),
      });

      if (response.ok) {
        // If the task is added successfully, fetch the updated tasks
        fetchTasks();
        setNewTask('');
      } else {
        console.error('Error adding task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
  
      setTasks(updatedTasks);
  
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'POST', // Use POST instead of PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !tasks.find((task) => task._id === taskId).completed }),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

  return (
    <div>
      <h1>To-Do App</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task._id)}
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
