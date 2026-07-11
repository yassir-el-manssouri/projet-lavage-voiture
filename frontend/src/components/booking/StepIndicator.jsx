import React from 'react';

const steps = [
  { id: 1, label: 'Prestation' },
  { id: 2, label: 'Véhicule' },
  { id: 3, label: 'Créneau' },
  { id: 4, label: 'Confirmation' },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200 z-0 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#2E4057] to-[#1A6FC4] transition-all duration-700 ease-in-out rounded-full"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500
                  ${isCompleted ? 'bg-[#2E4057] text-white shadow-lg shadow-slate-300' : ''}
                  ${isActive ? 'bg-[#1A6FC4] text-white shadow-xl ring-4 ring-blue-100 scale-110' : ''}
                  ${!isCompleted && !isActive ? 'bg-white text-slate-400 border-2 border-slate-200' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.id}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-black hidden sm:block transition-colors duration-300 ${isActive ? 'text-[#1A6FC4]' : isCompleted ? 'text-[#2E4057]' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
