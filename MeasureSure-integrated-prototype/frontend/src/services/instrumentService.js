import { apiRequest } from "./api.js";

const mapInstrument = (x) => x && ({
  id: x.id ?? x.instrument_id,
  type: x.type ?? x.instrument_type,
  manufacturer: x.manufacturer,
  model: x.model,
  serialNumber: x.serialNumber ?? x.serial_number,
  capacity: x.capacity,
  accuracy: x.accuracy,
  owner: x.owner,
  phone: x.phone,
  location: x.location,
  address: x.address,
  status: x.status,
  createdAt: x.createdAt ?? x.created_at,
});

export async function getInstruments() { return (await apiRequest("/instruments")).map(mapInstrument); }
export async function getInstrumentById(id) { const x = await apiRequest(`/instruments/${encodeURIComponent(id)}`); return x ? mapInstrument(x) : null; }
export async function getPublicInstrumentById(id) { const x = await apiRequest(`/public/instruments/${encodeURIComponent(id)}`); return x ? mapInstrument(x) : null; }
export async function createInstrument(values) { return mapInstrument(await apiRequest("/instruments", { method: "POST", body: JSON.stringify(values) })); }
export async function updateInstrument(id, values) { return mapInstrument(await apiRequest(`/instruments/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(values) })); }
