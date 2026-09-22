import { useUsersQuery } from "../hooks/useUsersQuery";
import { UserCard } from "../components/UserCard";
import { RotateCw, Loader2, AlertCircle } from "lucide-react";

export function QueryPage() {
  const { data: users, isLoading, isError, error, refetch, isFetching } = useUsersQuery();

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">Standard useQuery</h2>
          <p className="section-desc">
            Fetches and caches data in-memory from Zod response schema.
          </p>
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refetch users"
        >
          <RotateCw size={12} className={isFetching ? "spin-icon" : ""} />
          <span>{isFetching ? "Refetching..." : "Refetch"}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Fetching users with TanStack Query...</span>
        </div>
      ) : isError ? (
        <div className="error-alert" role="alert">
          <AlertCircle size={16} />
          <span>{error?.message ?? "Error fetching data"}</span>
        </div>
      ) : (
        <div className="cards-grid" role="list">
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
