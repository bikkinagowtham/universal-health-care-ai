import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown, X, Check } from 'lucide-react';
import {
  INDIA_LOCATIONS,
  getAllStates,
  getDistrictsForState,
  getCitiesForDistrictOrState,
  searchCitiesAcrossIndia,
} from '../../data/indiaLocations';

interface Props {
  selectedState: string;
  selectedCity: string;
  onChange: (state: string, city: string, district?: string) => void;
  compact?: boolean;
  label?: string;
}

export const LocationPicker: React.FC<Props> = ({
  selectedState,
  selectedCity,
  onChange,
  compact = false,
  label = 'Location (India)',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'browse'>('quick');

  const [state, setState] = useState(selectedState || 'ALL');
  const [district, setDistrict] = useState('ALL');
  const [city, setCity] = useState(selectedCity || 'ALL');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with incoming props
  useEffect(() => {
    setState(selectedState || 'ALL');
    setCity(selectedCity || 'ALL');
  }, [selectedState, selectedCity]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const states = getAllStates();
  const districts = state !== 'ALL' ? getDistrictsForState(state) : [];
  const cities = state !== 'ALL' ? getCitiesForDistrictOrState(state, district !== 'ALL' ? district : undefined) : [];

  const searchResults = searchCitiesAcrossIndia(searchTerm);

  const handleSelectQuick = (c: string, s: string, d?: string) => {
    setState(s);
    setCity(c);
    setDistrict(d || 'ALL');
    onChange(s, c, d);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setState('ALL');
    setDistrict('ALL');
    setCity('ALL');
    onChange('ALL', 'ALL', undefined);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayText =
    city !== 'ALL' && state !== 'ALL'
      ? `${city}, ${state}`
      : city !== 'ALL'
      ? city
      : state !== 'ALL'
      ? state
      : 'All India (Any Location)';

  return (
    <div className="relative" ref={dropdownRef}>
      {label && !compact && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left text-xs sm:text-sm font-semibold transition hover:border-sky-500 shadow-2xs cursor-pointer ${
          city !== 'ALL' || state !== 'ALL'
            ? 'text-sky-700 dark:text-sky-300 font-bold border-sky-300'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span className="truncate">{displayText}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {(city !== 'ALL' || state !== 'ALL') && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600"
              title="Reset Location"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Modal / Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-fade-in space-y-3">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeTab === 'quick' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs' : 'text-slate-500'
                }`}
              >
                Quick Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeTab === 'browse' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs' : 'text-slate-500'
                }`}
              >
                Browse State / City
              </button>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* TAB 1: QUICK SEARCH INPUT */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type any Indian city, district, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Autocomplete list */}
              <div className="max-h-60 overflow-y-auto space-y-1">
                {searchTerm.trim().length > 0 ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <button
                        key={`${item.city}-${item.state}-${idx}`}
                        type="button"
                        onClick={() => handleSelectQuick(item.city, item.state, item.district)}
                        className="w-full text-left p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{item.city}</div>
                          <div className="text-[10px] text-slate-400">
                            {item.district} District • {item.state}
                          </div>
                        </div>
                        {city.toLowerCase() === item.city.toLowerCase() && (
                          <Check className="w-4 h-4 text-sky-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500">
                      <div>No exact catalog match for &ldquo;{searchTerm}&rdquo;.</div>
                      <button
                        type="button"
                        onClick={() => handleSelectQuick(searchTerm.trim(), 'India')}
                        className="mt-2 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                      >
                        Use &ldquo;{searchTerm.trim()}&rdquo; as Custom Location
                      </button>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Hubs in India
                    </div>
                    {[
                      { city: 'Vijayawada', state: 'Andhra Pradesh', district: 'NTR' },
                      { city: 'Visakhapatnam', state: 'Andhra Pradesh', district: 'Visakhapatnam' },
                      { city: 'Guntur', state: 'Andhra Pradesh', district: 'Guntur' },
                      { city: 'Tirupati', state: 'Andhra Pradesh', district: 'Tirupati' },
                      { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
                      { city: 'Warangal', state: 'Telangana', district: 'Warangal' },
                      { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
                      { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai' },
                      { city: 'New Delhi', state: 'Delhi (NCT)', district: 'New Delhi' },
                      { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
                    ].map((hub) => (
                      <button
                        key={hub.city}
                        type="button"
                        onClick={() => handleSelectQuick(hub.city, hub.state, hub.district)}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{hub.city}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({hub.state})</span>
                        </div>
                        {city.toLowerCase() === hub.city.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURED HIERARCHY (State -> District -> City) */}
          {activeTab === 'browse' && (
            <div className="space-y-2.5 text-xs">
              {/* State Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  1. State / Union Territory ({states.length} total)
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    const nextState = e.target.value;
                    setState(nextState);
                    setDistrict('ALL');
                    setCity('ALL');
                    onChange(nextState, 'ALL', undefined);
                  }}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="ALL">All 28 States & 8 UTs</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              {state !== 'ALL' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    2. District / Region
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const nextDist = e.target.value;
                      setDistrict(nextDist);
                      setCity('ALL');
                      onChange(state, 'ALL', nextDist !== 'ALL' ? nextDist : undefined);
                    }}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="ALL">All Districts in {state}</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* City Select */}
              {state !== 'ALL' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    3. City / Town
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const nextCity = e.target.value;
                      setCity(nextCity);
                      onChange(state, nextCity, district !== 'ALL' ? district : undefined);
                      if (nextCity !== 'ALL') setIsOpen(false);
                    }}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="ALL">All Cities in {district !== 'ALL' ? district : state}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
              >
                Apply Location
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
