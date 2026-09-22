import { useProductsQuery } from "../hooks/useProductsQuery";
import { DataTable } from "../components/DataTable";
import { Loader2, AlertCircle } from "lucide-react";

export function TablePage() {
  const { data: products, isLoading, isError, error } = useProductsQuery();

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">TanStack Table Integration</h2>
          <p className="section-desc">
            Sorting, filtering, and pagination over mock datasets using @tanstack/react-table.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Generating table dataset from Zod schema...</span>
        </div>
      ) : isError ? (
        <div className="error-alert" role="alert">
          <AlertCircle size={16} />
          <span>{error?.message ?? "Failed to load products"}</span>
        </div>
      ) : (
        <DataTable data={products ?? []} />
      )}
    </div>
  );
}
