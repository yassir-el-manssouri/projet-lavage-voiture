import React from 'react';

const StatCard = ({ label, value, unit = '', icon, color = 'bg-[#1A6FC4]', trend }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 font-bold mb-1">{label}</p>
      <p className="text-3xl font-black text-[#2E4057]">
        {value}<span className="text-base font-bold text-slate-400 ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default StatCard;
