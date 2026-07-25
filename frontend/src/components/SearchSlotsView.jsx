import React, { useState } from "react";
import {
  MapPin, Car, Search,
  ChevronLeft, CheckCircle2, Filter, ArrowRight,
} from "lucide-react";
import MapComponent from "./MapComponent";

const SearchSlotsView = ({
  areas,
  selectedArea,
  setSelectedArea,
  handleAreaSelect,
  slots,
  selectedSlot,
  setSelectedSlot,
  handleBookSlot,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredAreas = areas.filter((area) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      area.name.toLowerCase().includes(q) ||
      area.address.toLowerCase().includes(q);
    const matchType = filterType === "All" || area.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <section className="animate-fade-in space-y-6">
      {!selectedArea ? (
        <>
          {/* Hero + Search */}
          <div className="relative overflow-hidden rounded-2xl p-8 border border-teal-500/20 dark:border-teal-700/20 bg-gradient-to-r from-teal-500/10 via-slate-50 to-teal-50/20 dark:from-teal-900/40 dark:via-slate-900 dark:to-slate-900">
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/10 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/20 dark:border-teal-500/25 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                <MapPin size={12} /> Find Parking in Chennai
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                Find & Book <span className="text-teal-600 dark:text-teal-400">Guaranteed Parking</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Click a pin on the map or select from the list to see available slots.
              </p>
            </div>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search location, area, landmark…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm outline-none transition-all
                    bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10
                    text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-9 pr-8 py-3 border rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer
                    bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10
                    text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="All">All Types</option>
                  <option value="Mall">Mall</option>
                  <option value="Theater">Theater</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Map + List split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {filteredAreas.length} location{filteredAreas.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filteredAreas.length === 0 ? (
                <div className="rounded-2xl p-8 text-center bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
                  <MapPin size={36} className="mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No locations match your search</p>
                </div>
              ) : filteredAreas.map((area, index) => (
                <button
                  key={area._id}
                  onClick={() => handleAreaSelect(area)}
                  className="w-full text-left rounded-2xl p-5 border transition-all duration-200 group active:scale-[0.98] animate-slide-up
                    bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 
                    hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-600/10 flex items-center justify-center shrink-0 group-hover:bg-teal-600/20 transition-colors">
                      <MapPin size={20} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {area.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{area.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700/60 rounded-full text-slate-600 dark:text-slate-400 uppercase font-medium">
                          {area.type}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {area.totalSlots} total slots
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-teal-600 dark:text-teal-400 font-bold">₹20</p>
                      <p className="text-xs text-slate-400">/hour</p>
                      <ArrowRight size={16} className="mt-1 ml-auto text-slate-400 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl" style={{ height: 600 }}>
              <MapComponent
                areas={filteredAreas}
                onAreaSelect={handleAreaSelect}
                selectedArea={selectedArea}
              />
            </div>
          </div>
        </>
      ) : (
        /* === SLOT BOOKING SECTION === */
        <div className="space-y-6 animate-slide-up">
          {/* Back + Header */}
          <button
            onClick={() => { setSelectedArea(null); setSelectedSlot(null); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border
              bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white"
          >
            <ChevronLeft size={18} /> Back to Finder
          </button>

          {/* Area info */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-teal-600/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={26} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full uppercase font-semibold">
                      {selectedArea.type}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedArea.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400 dark:text-slate-500" />
                    {selectedArea.address}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex gap-3 shrink-0">
                <div className="rounded-xl p-4 text-center min-w-[110px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Hourly</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹20</p>
                </div>
                <div className="rounded-xl p-4 text-center min-w-[110px] bg-teal-50/50 dark:bg-slate-800 border border-teal-200 dark:border-teal-500/20">
                  <p className="text-xs text-teal-600 dark:text-slate-500 uppercase font-semibold mb-1">Daily</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">₹150</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini map for selected area */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10" style={{ height: 260 }}>
            <MapComponent
              areas={[selectedArea]}
              onAreaSelect={() => {}}
              selectedArea={selectedArea}
            />
          </div>

          {/* Slot legend */}
          <div className="flex items-center gap-6 px-1">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600" />
              Available
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 rounded-md bg-teal-600 border border-teal-400" />
              Selected
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-900/50 opacity-50" />
              Booked
            </div>
          </div>

          {/* Slot grid */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Select an Available Slot{slots.length > 0 ? ` — ${slots.filter(s => !s.isBooked).length} available of ${slots.length}` : ""}
            </h3>
            {slots.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No slots found for this area.</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?._id === slot._id;
                  return (
                    <button
                      key={slot._id}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all duration-200 text-xs font-bold
                        ${slot.isBooked
                          ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-800 cursor-not-allowed opacity-50"
                          : isSelected
                            ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-600/30 -translate-y-0.5"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-600/10 hover:text-teal-600 dark:hover:text-teal-400"
                        }
                      `}
                    >
                      <Car size={16} className={slot.isBooked ? "text-red-700 dark:text-red-800" : isSelected ? "text-white" : "text-slate-400 dark:text-slate-500"} />
                      {slot.slotNumber}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Book button (sticky footer) */}
          {selectedSlot && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={handleBookSlot}
                className="flex items-center gap-3 px-10 py-4 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-teal-600/40 transition-all"
              >
                <CheckCircle2 size={24} />
                Book Slot {selectedSlot.slotNumber}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchSlotsView;
