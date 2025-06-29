import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import './App.css';
import { setDoc, getDocs, collection, doc, query, where } from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut
} from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { shareTask } from './api';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  loginWithOAuth
} from './api';

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);

      await setDoc(doc(db, 'users', loggedInUser.uid), {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName: loggedInUser.displayName || ''
      });

      await loginWithOAuth({
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName: loggedInUser.displayName
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  const addTodo = async () => {
    if (input.trim()) {
      await createTask({
        text: input,
        completed: false
      });
      setInput('');
      toast.success("Task added!");
      fetchTasks();
    }
  };

  const toggleTodo = async (id, current) => {
    await updateTask(id, { completed: !current });
    toast.success('Task status updated');
    fetchTasks();
  };

  const deleteTodo = async (id) => {
    await deleteTask(id);
    toast.warn('Task deleted');
    fetchTasks();
  };

  const startEditing = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const handleSave = async (id) => {
    await updateTask(id, { text: editText });
    setEditId(null);
    setEditText('');
    toast.success('Task updated');
    fetchTasks();
  };

  const handleShare = async (todo) => {
  if (!todo.shareWith) {
    toast.warning("Please enter an email to share with.");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/shared',
      {
        from: user.email,
        to: todo.shareWith.trim(),
        task: todo.text
      },
      {
        withCredentials: true,
      }
    );

    toast.success("Task shared successfully!");
  } catch (error) {
    toast.error("Error sharing task: " + error.message);
  }
};


  const fetchTasks = async () => {
  try {
    const res = await getTasks();
    setTodos(res.data);

    // ✅ Save to localStorage for offline use
    localStorage.setItem('cachedTasks', JSON.stringify(res.data));
  } catch (err) {
    toast.error("You're offline. Showing cached tasks.");

    // ✅ Load from localStorage if offline or fetch failed
    const cached = localStorage.getItem('cachedTasks');
    if (cached) {
      setTodos(JSON.parse(cached));
    }
  }
};


  useEffect(() => {
  if (!navigator.onLine) {
    const cached = localStorage.getItem('cachedTasks');
    if (cached) {
      setTodos(JSON.parse(cached));
    }
  }
}, []);

  
  const fetchSharedTasks = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shared/${user.email}`);
    const shared = res.data;

    setTodos(prev => [
      ...prev,
      ...shared.map(task => ({
        _id: `shared-${task._id}`, // unique ID
        text: `[Shared] ${task.task}`,
        completed: false,
        shared: true
      }))
    ]);
  } catch (error) {
    toast.error("Failed to fetch shared tasks");
  }
};


  useEffect(() => {
  if (user) {
    fetchTasks();       
    fetchSharedTasks(); 
  }
}, [user]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <ToastContainer position="top-right" autoClose={2000} />

      <h1>Todo App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          <img src={user.photoURL} alt="Profile" width="60" style={{ borderRadius: "50%" }} />
          <p>{user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="login-buttons">
          <button onClick={() => handleLogin(googleProvider)}>
            <FcGoogle size={20} style={{ marginRight: "5px" }} /> Sign in with Google
          </button>
          <button onClick={() => handleLogin(githubProvider)}>
            <FaGithub size={20} style={{ marginRight: "5px" }} /> Sign in with GitHub
          </button>
        </div>
      )}

      <button onClick={() => setDark(!dark)} className="toggle-mode">
        {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {user && (
        <>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addTodo}>Add</button>
          </div>

          <div className="filter-buttons">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
            <button onClick={() => setFilter('incomplete')}>Incomplete</button>
          </div>

          {!navigator.onLine && <p style={{ color: 'orange' }}>⚠️ You are in offline mode</p>}


          <ul>
            {filteredTodos.map(todo => (
              <li key={todo._id}>
                {editId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleSave(todo._id)}>Save</button>
                  </>
                ) : (
                  <>
                    <div className="todo-item">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id, todo.completed)}
                      />
                      <span
                        style={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleTodo(todo._id, todo.completed)}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="icons">
                      <FaEdit onClick={() => startEditing(todo)} style={{ cursor: 'pointer', color: 'blue' }} />
                      <FaTrash onClick={() => deleteTodo(todo._id)} style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }} />
                    </div>
                    <div className="share-input">
                      <input
                        type="text"
                        placeholder="Share with..."
                        value={todo.shareWith || ''}
                        onChange={(e) =>
                          setTodos(todos.map(t =>
                            t._id === todo._id ? { ...t, shareWith: e.target.value } : t
                          ))
                        }
                      />
                      <button onClick={() => handleShare(todo)}>Share</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;