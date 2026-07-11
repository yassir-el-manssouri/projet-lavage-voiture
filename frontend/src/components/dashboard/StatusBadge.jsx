import React from 'react';
import { STATUS_LABELS } from '../../data/mockData';

const StatusBadge = ({ status }) => {
  const cfg = STATUS_LABELS[status] || STATUS_LABELS.waiting;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
