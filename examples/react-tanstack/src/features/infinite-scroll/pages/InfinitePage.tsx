import { useInfiniteUsers } from "../hooks/useInfiniteUsers";
import { UserCard } from "../../query/components/UserCard";
import { Loader2, ArrowDown } from "lucide-react";

export function InfinitePage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers();

  const allUsers = data?.pages.flat() ?? [];

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">useInfiniteQuery Pagination</h2>
          <p className="section-desc">
            Demonstrates multi-page data accumulation with in-memory mock responses.
          </p>
        </div>
        <span className="count-pill">
          Loaded: {allUsers.length} users ({data?.pages.length ?? 0} pages)
        </span>
      </div>

      {isLoading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Loading first page of users...</span>
        </div>
      ) : isError ? (
        <div className="error-alert" role="alert">
          {error?.message}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="cards-grid" role="list">
            {allUsers.map((user, idx) => (
              <UserCard key={`${user.id}-${idx}`} user={user} />
            ))}
          </div>

          <div className="pagination-footer">
            {hasNextPage ? (
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                aria-label="Load next page"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 size={16} className="spin-icon text-white" />
                    <span>Fetching next page...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={16} />
                    <span>Load Next Page (3 Items)</span>
                  </>
                )}
              </button>
            ) : (
              <p className="text-end-message">All mock pages loaded (End of list)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
