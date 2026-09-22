import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodos } from "../src/hooks/useTodos";

describe("useTodos Hook with @krishtz/mock-client", () => {
  it("loads initial list of mock todos on mount", async () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos.length).toBeGreaterThan(0);
    expect(result.current.todos[0]).toHaveProperty("id");
    expect(result.current.todos[0]).toHaveProperty("title");
    expect(result.current.todos[0]).toHaveProperty("status");
    expect(result.current.error).toBeNull();
  });

  it("adds a new todo preserving custom title", async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCount = result.current.todos.length;

    await act(async () => {
      await result.current.addTodo("Write Unit Tests");
    });

    expect(result.current.todos.length).toBe(initialCount + 1);
    expect(result.current.todos[0]?.title).toBe("Write Unit Tests");
    expect(typeof result.current.todos[0]?.id).toBe("string");
  });

  it("toggles todo completion status via mockApi PATCH", async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const targetId = result.current.todos[0]?.id;
    expect(targetId).toBeDefined();

    const previousCompleted = result.current.todos[0]?.completed;

    await act(async () => {
      await result.current.toggleTodo(targetId!);
    });

    const updated = result.current.todos.find((t) => t.id === targetId);
    expect(updated?.completed).toBe(!previousCompleted);
  });

  it("deletes a todo via mockApi DELETE", async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const targetId = result.current.todos[0]?.id;
    expect(targetId).toBeDefined();
    const prevCount = result.current.todos.length;

    await act(async () => {
      await result.current.deleteTodo(targetId!);
    });

    expect(result.current.todos.length).toBe(prevCount - 1);
    expect(result.current.todos.find((t) => t.id === targetId)).toBeUndefined();
  });
});
