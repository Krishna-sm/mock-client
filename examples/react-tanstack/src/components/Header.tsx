import { NavLink } from "react-router-dom";
import { Database, Zap, RefreshCw, Table as TableIcon } from "lucide-react";

export function Header() {
  return (
    <header className="page-header">
      <div className="header-top">
        <div>
          <h1 className="main-title">TanStack & Mock Client</h1>
          <p className="sub-title">Feature-Driven React application with zero backend</p>
        </div>
        <div className="badge-tag">@krishtz/mock-client</div>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        <NavLink to="/query" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
          <Database size={14} />
          <span>useQuery</span>
        </NavLink>
        <NavLink to="/mutation" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
          <Zap size={14} />
          <span>useMutation</span>
        </NavLink>
        <NavLink
          to="/infinite-scroll"
          className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
        >
          <RefreshCw size={14} />
          <span>useInfiniteQuery</span>
        </NavLink>
        <NavLink to="/table" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
          <TableIcon size={14} />
          <span>TanStack Table</span>
        </NavLink>
      </nav>
    </header>
  );
}
