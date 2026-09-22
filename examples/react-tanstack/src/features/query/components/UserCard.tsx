import type { User } from "../../../types";
import { User as UserIcon, Mail } from "lucide-react";

interface UserCardProps {
  readonly user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="card-item" data-testid={`user-${user.id}`}>
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
        <span className="id-tag">{user.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}
