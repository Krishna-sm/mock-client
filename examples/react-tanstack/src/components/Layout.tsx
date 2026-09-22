import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="app-container">
      <Header />
      <main className="content-container">
        <Outlet />
      </main>
      <footer className="page-footer">
        Powered by <code>@krishtz/mock-client</code> &middot; TanStack Query &middot; TanStack Table
        &middot; React Router
      </footer>
    </div>
  );
}
