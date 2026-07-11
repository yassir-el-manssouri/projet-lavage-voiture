import React, { useState } from 'react';
import { TIME_SLOTS, UNAVAILABLE_SLOTS } from '../../data/mockData';

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const Step3_DateTime = ({ data, onChange }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [unavailableFromAPI, setUnavailableFromAPI] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const fetchAvailability = (dateStr) => {
    setLoadingAvailability(true);
    import('../../services/api').then(m => m.getAvailability(dateStr))
      .then(slots => {
        setUnavailableFromAPI(slots);
        setLoadingAvailability(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingAvailability(false);
      });
  };

  const handleDayClick = (day) => {
    const clicked = new Date(year, month, day);
    if (clicked < new Date(today.setHours(0, 0, 0, 0))) return;
    const dateStr = clicked.toISOString().split('T')[0];
    onChange({ ...data, date: dateStr, time: undefined });
    fetchAvailability(dateStr);
  };

  const handleTimeClick = (slot) => {
    if (unavailableFromAPI.includes(slot) || UNAVAILABLE_SLOTS.includes(slot)) return;
    onChange({ ...data, time: slot });
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelectedDay = (day) => {
    if (!data.date) return false;
    const d = new Date(data.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isPast = (day) => {
    const d = new Date(year, month, day);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    : null;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-black text-[#2E4057]">Choisissez votre créneau</h2>
        <p className="text-slate-500 mt-2 font-medium">Sélectionnez une date puis un horaire disponible</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendrier */}
        <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-heading font-black text-[#2E4057]">{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1 uppercase tracking-wider">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const past = isPast(day);
              const selected = isSelectedDay(day);
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={past}
                  className={`aspect-square flex items-center justify-center text-sm rounded-xl font-bold transition-all duration-200
                    ${past ? 'text-slate-300 cursor-not-allowed' : ''}
                    ${selected ? 'bg-[#2E4057] text-white shadow-md' : ''}
                    ${!past && !selected ? 'hover:bg-blue-50 text-[#2E4057] hover:text-[#1A6FC4]' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Créneaux horaires */}
        <div>
          {data.date ? (
            <>
              <p className="text-sm font-bold text-[#2E4057] mb-4 capitalize">
                📅 Créneaux pour le <span className="text-[#1A6FC4]">{formattedDate}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const unavailable = unavailableFromAPI.includes(slot) || UNAVAILABLE_SLOTS.includes(slot);
                  const selected = data.time === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => handleTimeClick(slot)}
                      disabled={unavailable}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all duration-200
                        ${unavailable ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through' : ''}
                        ${selected ? 'border-[#1A6FC4] bg-[#1A6FC4] text-white shadow-md' : ''}
                        ${!unavailable && !selected ? 'border-slate-200 text-[#2E4057] hover:border-[#1A6FC4] hover:text-[#1A6FC4]' : ''}
                      `}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#1A6FC4] inline-block"></span> Disponible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span> Indisponible
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200">
              <span className="text-4xl">📅</span>
              <p className="font-bold text-center">Sélectionnez d'abord une date dans le calendrier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3_DateTime;
