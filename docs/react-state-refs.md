# React: state, refs, mount vs re-render

Core ideas behind the todo list in [src/App.tsx](../src/App.tsx).

## Re-render vs mount

Calling `setTodos` **re-renders** `App`: React runs the function again, including
`todos.map(...)`, and diffs the new JSX against the old. That is *not* the same
as remounting the whole list.

- **Re-render** — recalculate the UI description; reuse DOM nodes when `key`s match.
- **Mount** — a DOM node appears for the first time (e.g. a newly added todo).
- **Unmount** — a DOM node is removed (e.g. a deleted todo).

Stable `key={todo.id}` is what lets React reuse the right row across updates.
Index keys break on delete because identity was tied to position.

## `useState` — data the UI depends on

```ts
const [todos, setTodos] = useState<Todo[]>([]);
```

See [src/App.tsx](../src/App.tsx#L6).

State survives re-renders. Updating it with `setTodos` **triggers** a re-render
so the screen can change. Never mutate the array in place — replace it
(`map` / `filter` / spread) so React sees a new value.

## `useRef` — memory that does *not* re-render

```ts
const todoInputMap = useRef(new Map<string, HTMLInputElement>());
```

See [src/App.tsx](../src/App.tsx#L8).

`useRef` returns a box: `{ current: ... }`. The box survives re-renders, but
changing `.current` does **not** re-render. Use it for handles and bookkeeping
(DOM nodes, timers) — not for data the user should see.

| | `useState` | `useRef` |
|---|---|---|
| Survives re-renders? | Yes | Yes |
| Update causes re-render? | Yes | No |
| Typical use | UI data | DOM handles, “remember without redrawing” |

## Callback `ref` — mount / unmount hooks

```tsx
<input
  ref={(el) => {
    if (el) {
      // mount: el is the DOM node
      todoInputMap.current.set(todo.id, el);
    } else {
      // unmount: el is null
      todoInputMap.current.delete(todo.id);
    }
  }}
/>
```

See [src/App.tsx](../src/App.tsx#L29).

React calls that function when the element is attached (`el` = node) or
detached (`el` = `null`). That’s how we keep a `Map` of id → input for
imperative `.focus()` after delete.

There is no controlled `focused={true}` prop like `value={...}`. Focus is a
browser concern; you call `element.focus()` when you need it.
