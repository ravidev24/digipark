import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Swal from 'sweetalert2';

const AddParkingAreaView = ({ token, fetchAreas, API_URL }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(13.0827);
  const [lng, setLng] = useState(80.2707);
  const [type, setType] = useState("General");
  const [totalSlots, setTotalSlots] = useState(10);
  const [pricePerHour, setPricePerHour] = useState(20);
  const [loading, setLoading] = useState(false);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setLat(lat);
        setLng(lng);
        
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (res.data) {
            const addr = res.data.display_name || "";
            setAddress(addr);
            
            const nameVal = res.data.name || res.data.address?.amenity || res.data.address?.building || res.data.address?.road || "New Custom Spot";
            setName(nameVal);
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      }
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !lat || !lng) {
      Swal.fire({ title: "Validation Error", text: "Please select a location on the map and input a name/address", icon: "warning" });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/areas`, {
        name, address, lat, lng, type, totalSlots, pricePerHour
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ title: "Success!", text: "New parking hub and slots created successfully!", icon: "success" });
      fetchAreas();
      setName("");
      setAddress("");
    } catch (err) {
      Swal.fire({ title: "Creation Failed", text: err.response?.data?.message || err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-10 max-w-4xl mx-auto animate-slide-in">
      <h2 className="text-3xl font-black mb-6">Add New Parking Hub</h2>
      <p className="text-slate-400 mb-8 font-medium">Click on the map to select a parking location in Chennai. The address and location name will auto-populate.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Select Location on Map</label>
          <div className="h-[350px] rounded-2xl overflow-hidden border border-white/5 relative">
            <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} />
              <MapClickHandler />
            </MapContainer>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Hub Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 outline-none text-white focus:ring-2 focus:ring-indigo-500" placeholder="e.g. T-Nagar Plaza" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Full Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} required rows="3" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 outline-none text-white focus:ring-2 focus:ring-indigo-500" placeholder="e.g. G.N. Chetty Road, Chennai" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Slots</label>
              <input type="number" min="1" value={totalSlots} onChange={e => setTotalSlots(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 outline-none text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Price per Hour (₹)</label>
              <input type="number" min="1" value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 outline-none text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Hub Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/5 outline-none text-white focus:ring-2 focus:ring-indigo-500">
              <option value="General">General</option>
              <option value="Mall">Mall</option>
              <option value="Theater">Theater</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all">
            {loading ? "Creating..." : "Create Parking Hub"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddParkingAreaView;
