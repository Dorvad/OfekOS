interface EmptyStateProps {
  message: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium text-gray-500">{message}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
