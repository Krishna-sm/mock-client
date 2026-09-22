import { useTodos } from "./hooks/useTodos";
import { CreateTodoForm } from "./components/CreateTodoForm";
import { TodoList } from "./components/TodoList";
import { RotateCw } from "lucide-react";

export function App() {
  const {
    todos,
    loading,
    error,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh,
  } = useTodos();

  return (
    <div className="app-container">
      <header className="page-header">
        <div>
          <h1 className="main-title">Mock Client Demo</h1>
          <p className="sub-title">In-memory mock API runtime with Zod contracts</p>
        </div>
        <button type="button" className="btn-outline" onClick={refresh} aria-label="Refresh todos">
          <RotateCw size={12} />
          <span>Regenerate</span>
        </button>
      </header>

      {error && (
        <div className="error-alert" role="alert">
          {error}
        </div>
      )}

      <main className="main-content">
        <CreateTodoForm onAdd={addTodo} />

        <TodoList
          todos={todos}
          loading={loading}
          filter={filter}
          onFilterChange={setFilter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          stats={stats}
        />
      </main>

      <footer className="page-footer">
        Powered by <code>@krishtz/mock-client</code> &middot; Zero backend &middot; Zero MSW
      </footer>
    </div>
  );
}

export default App;
