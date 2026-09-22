import { useEffect, useRef } from "react";
import { useInfiniteUsers } from "../hooks/useInfiniteUsers";
import { UserCard } from "../../query/components/UserCard";
import { Loader2 } from "lucide-react";

export function InfinitePage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const allUsers = data?.pages.flat() ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">Infinite Scroll (Intersection Observer)</h2>
          <p className="section-desc">
            Automatically loads more mock data as you scroll down using IntersectionObserver and
            TanStack useInfiniteQuery.
          </p>
        </div>
        <span className="count-pill">
          Loaded: {allUsers.length} users ({data?.pages.length ?? 0} pages)
        </span>
      </div>

      {isLoading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Loading initial users...</span>
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

          <div ref={loadMoreRef} className="pagination-footer">
            {isFetchingNextPage ? (
              <div className="state-message py-4" role="status">
                <Loader2 size={18} className="spin-icon" />
                <span>Loading more users on scroll...</span>
              </div>
            ) : hasNextPage ? (
              <div className="text-center py-2 text-neutral-400 text-xs">
                Scroll down to load more records automatically...
              </div>
            ) : (
              <p className="text-end-message">All mock records loaded (End of list)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
