import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Plus, Edit, Trash2, X, Navigation, Loader2 } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom red pin for the selected position
const selectedPin = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="54" viewBox="0 0 40 56">
    <ellipse cx="20" cy="53" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
    <path d="M20 2C11.16 2 4 9.16 4 18c0 12 16 34 16 34s16-22 16-34C36 9.16 28.84 2 20 2z"
      fill="#ef4444" stroke="white" stroke-width="2"/>
    <circle cx="20" cy="18" r="8" fill="white" opacity="0.9"/>
    <text x="20" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#ef4444" font-family="Arial">P</text>
  </svg>`,
  className: "",
  iconSize: [38, 54],
  iconAnchor: [19, 54],
  popupAnchor: [0, -54],
});

// Existing area teal pin
const areaPin = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="46" viewBox="0 0 40 56">
    <ellipse cx="20" cy="53" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
    <path d="M20 2C11.16 2 4 9.16 4 18c0 12 16 34 16 34s16-22 16-34C36 9.16 28.84 2 20 2z"
      fill="#0d9488" stroke="white" stroke-width="2"/>
    <circle cx="20" cy="18" r="8" fill="white" opacity="0.9"/>
    <text x="20" y="22" text-anchor="middle" font-size="11" font-weight="bold" fill="#0d9488" font-family="Arial">P</text>
  </svg>`,
  className: "",
  iconSize: [32, 46],
  iconAnchor: [16, 46],
  popupAnchor: [0, -46],
});

// Map click handler component
const MapClickHandler = ({ onPick, geocoding }) => {
  useMapEvents({
    click: async (e) => {
      if (!geocoding) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Pan to position
function PanTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
}

// -----------------------------------------------------------------------
const AdminAreasView = ({ token, fetchAreas }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState("");

  // form state for creating
  const emptyForm = { name: "", address: "", lat: 13.0827, lng: 80.2707, type: "General", totalSlots: 10, pricePerHour: 20 };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAreas(); }, []);

  const loadAreas = async () => {
    try {
      const res = await axios.get(`${API_URL}/areas`);
      setAreas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reverse geocode lat/lng → name + address
  const reverseGeocode = async (lat, lng, isEdit = false) => {
    setGeocoding(true);
    setGeocodeStatus("Fetching location details…");
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.data) {
        const d = res.data;
        const addr = d.address || {};
        const nameParts = [
          addr.amenity,
          addr.building,
          addr.shop,
          addr.tourism,
          addr.road,
          addr.suburb,
          addr.neighbourhood,
        ].filter(Boolean);

        const suggestedName = d.name || nameParts[0] || "Custom Parking Spot";
        const fullAddress = [
          addr.road,
          addr.suburb || addr.neighbourhood,
          addr.city || addr.town || addr.village || "Chennai",
          addr.state,
        ].filter(Boolean).join(", ");

        if (isEdit) {
          setEditing(prev => ({ ...prev, lat, lng, name: suggestedName, address: fullAddress || d.display_name }));
        } else {
          setForm(prev => ({ ...prev, lat, lng, name: suggestedName, address: fullAddress || d.display_name }));
        }
        setGeocodeStatus("✓ Location found! Edit the name/address if needed.");
      }
    } catch (err) {
      setGeocodeStatus("⚠ Could not fetch address — please type it manually.");
      if (isEdit) setEditing(prev => ({ ...prev, lat, lng }));
      else setForm(prev => ({ ...prev, lat, lng }));
    } finally {
      setGeocoding(false);
    }
  };

  const handleMapClick = (lat, lng) => {
    reverseGeocode(lat, lng, !!editing);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/areas`, form, authHeaders(token));
      Swal.fire({ title: "Area Created!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#f8fafc" });
      setForm(emptyForm);
      setShowForm(false);
      setGeocodeStatus("");
      loadAreas();
      if (fetchAreas) fetchAreas();
    } catch (err) {
      Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error", background: "#1e293b", color: "#f8fafc" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/areas/${editing._id}`, editing, authHeaders(token));
      Swal.fire({ title: "Area Updated!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#f8fafc" });
      setEditing(null);
      setGeocodeStatus("");
      loadAreas();
      if (fetchAreas) fetchAreas();
    } catch (err) {
      Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error", background: "#1e293b", color: "#f8fafc" });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete area?",
      text: "All slots and bookings in this area will be removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      background: "#1e293b",
      color: "#f8fafc",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/areas/${id}`, authHeaders(token));
        Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#f8fafc" });
        loadAreas();
        if (fetchAreas) fetchAreas();
      } catch (err) {
        Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error", background: "#1e293b", color: "#f8fafc" });
      }
    }
  };

  const activeForm = editing || (showForm ? form : null);
  const activeLat = activeForm ? Number(activeForm.lat) : 13.0827;
  const activeLng = activeForm ? Number(activeForm.lng) : 80.2707;

  const renderForm = () => {
    const isEdit = !!editing;
    const data = isEdit ? editing : form;
    const set = (field, val) => isEdit
      ? setEditing(prev => ({ ...prev, [field]: val }))
      : setForm(prev => ({ ...prev, [field]: val }));

    return (
      <div className="admin-card mb-6 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "✏️ Edit Parking Area" : "➕ Add New Parking Area"}
          </h2>
          <button onClick={() => { setShowForm(false); setEditing(null); setGeocodeStatus(""); }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Map */}
          <div>
            <label className="form-label flex items-center gap-2 mb-3">
              <Navigation size={14} className="text-blue-400" />
              Click on the map to set location
            </label>
            <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ height: 340 }}>
              <MapContainer
                center={[activeLat || 13.0827, activeLng || 80.2707]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {/* Show existing areas */}
                {areas.filter(a => a.lat && a.lng && a._id !== editing?._id).map(a => (
                  <Marker key={a._id} position={[a.lat, a.lng]} icon={areaPin} />
                ))}
                {/* Current pin */}
                {activeLat && activeLng && (
                  <>
                    <Marker position={[activeLat, activeLng]} icon={selectedPin} />
                    <PanTo lat={activeLat} lng={activeLng} />
                  </>
                )}
                <MapClickHandler onPick={handleMapClick} geocoding={geocoding} />
              </MapContainer>
              {geocoding && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] rounded-xl">
                  <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-xl border border-white/10">
                    <Loader2 size={18} className="animate-spin text-blue-400" />
                    <span className="text-sm text-white">Fetching address…</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {data.lat && data.lng ? `📍 ${Number(data.lat).toFixed(5)}, ${Number(data.lng).toFixed(5)}` : "No location selected"}
              </span>
              {geocodeStatus && (
                <span className={`text-xs ${geocodeStatus.startsWith("✓") ? "text-green-400" : geocodeStatus.startsWith("⚠") ? "text-amber-400" : "text-slate-400"}`}>
                  {geocodeStatus}
                </span>
              )}
            </div>
          </div>

          {/* Right: Form fields */}
          <form onSubmit={isEdit ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="form-label">Area / Place Name</label>
              <input
                className="form-input"
                value={data.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Express Avenue Mall"
                required
              />
            </div>
            <div>
              <label className="form-label">Full Address</label>
              <textarea
                className="form-input resize-none"
                rows={2}
                value={data.address}
                onChange={e => set("address", e.target.value)}
                placeholder="Street, Area, City"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={data.lat}
                  onChange={e => set("lat", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={data.lng}
                  onChange={e => set("lng", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={data.type}
                onChange={e => set("type", e.target.value)}
              >
                <option value="Mall">Mall</option>
                <option value="Theater">Theater</option>
                <option value="General">General</option>
              </select>
            </div>
            {!isEdit && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Total Slots</label>
                  <input type="number" min="1" className="form-input" value={data.totalSlots} onChange={e => set("totalSlots", e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Price/Hour (₹)</label>
                  <input type="number" min="1" className="form-input" value={data.pricePerHour} onChange={e => set("pricePerHour", e.target.value)} required />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-admin flex-1">
                {isEdit ? "Update Area" : "Create Parking Area"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); setGeocodeStatus(""); }}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Parking Area Management</h1>
          <p className="admin-page-subtitle">Click on the map to add or edit parking locations</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setGeocodeStatus(""); }}
          className="btn-admin flex items-center gap-2"
        >
          <Plus size={18} /> {showForm ? "Cancel" : "Add New Area"}
        </button>
      </div>

      {(showForm || editing) && renderForm()}

      {/* Areas grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <p className="text-slate-500 col-span-full text-center py-12">Loading areas…</p>
        ) : areas.length === 0 ? (
          <p className="text-slate-500 col-span-full text-center py-12">No areas yet. Click "Add New Area" to get started.</p>
        ) : areas.map((area) => (
          <div key={area._id} className="admin-card group hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                <MapPin size={22} className="text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 bg-slate-700 rounded-full text-slate-300 uppercase font-medium">{area.type}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{area.name}</h3>
            <p className="text-sm text-slate-400 mb-1 line-clamp-2">{area.address}</p>
            <p className="text-xs text-slate-500 mb-4">
              📍 {area.totalSlots} slots
              {area.lat && area.lng ? ` · ${Number(area.lat).toFixed(3)}, ${Number(area.lng).toFixed(3)}` : ""}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing({ ...area }); setShowForm(false); setGeocodeStatus(""); }}
                className="flex-1 py-2 bg-slate-700 hover:bg-blue-600 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors text-slate-300 hover:text-white"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(area._id)}
                className="flex-1 py-2 bg-slate-700 hover:bg-red-600 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors text-slate-300 hover:text-white"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAreasView;
