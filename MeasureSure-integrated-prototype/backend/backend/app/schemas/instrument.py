from pydantic import BaseModel

class InstrumentCreate(BaseModel):
    id: str | None = None
    type: str | None = None
    instrumentType: str | None = None
    instrument_name: str | None = None
    manufacturer: str
    model: str
    serialNumber: str
    capacity: str
    accuracy: str
    owner: str
    phone: str
    location: str | None = None
    address: str
    status: str = "PENDING"
    createdAt: str | None = None
