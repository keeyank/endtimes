import { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "todos"

type Todo = { 
  id: string; 
  text: string;
  done: boolean
};

export function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
    return [{id: crypto.randomUUID(), text: "", done: false }]
  });

  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

  const todoInputMap = useRef(new Map<string, HTMLInputElement>());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos])

  useEffect(() => {
    if (pendingFocusId == null) return;
    todoInputMap.current.get(pendingFocusId)?.focus();
    setPendingFocusId(null);
  }, [pendingFocusId]);

  function insertTodo(id: string, index: number) {
    const next = [
      ...todos.slice(0, index),
      { id, text: "", done: false },
      ...todos.slice(index),
    ];
    setTodos(next);
  }

  // Callers should not override id in updates
  function updateTodo(id: string, updates: Partial<Todo>) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function insertTodoWithFocus(index: number) {
    const id = crypto.randomUUID();
    insertTodo(id, index);
    setPendingFocusId(id);
  }

  return (
    <main>
      <h1>endtimes</h1>
      <button onClick={() => insertTodoWithFocus(todos.length)}>Add todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => updateTodo(todo.id, { done: e.target.checked })}
            />
            <input
              ref={(el) => {
                if (el) {
                  todoInputMap.current.set(todo.id, el);
                } else {
                  todoInputMap.current.delete(todo.id);
                }
              }}
              style={{ textDecoration: todo.done ? "line-through" : "none" }}
              disabled={todo.done}
              value={todo.text}
              onChange={(e) => updateTodo(todo.id, { text: e.target.value })}
              onKeyDown={(e) => {
                if (todo.text === "" && e.key === "Backspace") {
                  e.preventDefault();
                  if (todos.length > 1) {
                    const indexToFocus = index === 0 ? 1 : index - 1;
                    setPendingFocusId(todos[indexToFocus].id);
                    deleteTodo(todo.id);
                  }
                }
                if (e.key === "Enter") {
                  insertTodoWithFocus(index + 1);
                }
              }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
