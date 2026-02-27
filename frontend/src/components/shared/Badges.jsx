import { STATUS_COLORS, PRIORITY_COLORS } from '../../hooks/api';

export function StatusBadge({ status }) {
  return (
    <span className={STATUS_COLORS[status] || 'badge-pending'}>
      {status?.replace('-', ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-700'}`}>
      {priority}
    </span>
  );
}
