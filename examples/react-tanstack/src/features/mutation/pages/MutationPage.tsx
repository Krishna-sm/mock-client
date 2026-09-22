import { useUsersQuery } from "../../query/hooks/useUsersQuery";
import { useCreateUserMutation, useDeleteUserMutation } from "../hooks/useUserMutations";
import { UserForm } from "../components/UserForm";
import { Trash2, Loader2, User as UserIcon, Mail } from "lucide-react";

export function MutationPage() {
  const { data: users, isLoading } = useUsersQuery();
  const createMutation = useCreateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">useMutation & Cache Updates</h2>
          <p className="section-desc">
            Executes POST and DELETE mutations against mockApi, updating the TanStack Query cache.
          </p>
        </div>
      </div>

      <UserForm
        onAdd={async (data) => createMutation.mutateAsync(data)}
        isPending={createMutation.isPending}
      />

      {isLoading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Loading users...</span>
        </div>
      ) : users?.length === 0 ? (
        <div className="state-empty">
          <p>No users found. Create one above.</p>
        </div>
      ) : (
        <div className="cards-grid" role="list">
          {users?.map((user) => (
            <div key={user.id} className="card-item" data-testid={`user-${user.id}`}>
              <div className="card-left">
                <div className="card-avatar">
                  <UserIcon size={14} />
                </div>
                <div className="card-info">
                  <span className="card-title">{user.name}</span>
                  <span className="card-sub">
                    <Mail size={11} /> {user.email}
                  </span>
                </div>
              </div>
              <div className="card-right">
                <span className="status-tag">{user.role}</span>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => deleteMutation.mutate(user.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
