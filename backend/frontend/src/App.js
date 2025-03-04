import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

// const API_URL = "http://localhost:5100/items";
const API_URL = "/api/items";

function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => setItems(res.data));
  }, []);

  const addItem = () => {
    if (!text) return;
    axios.post(API_URL, { text }).then((res) => {
      setItems([...items, res.data]);
      setText("");
    });
  };

  return (
    <div className="App-header">
      <h1>To-Do List</h1>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;