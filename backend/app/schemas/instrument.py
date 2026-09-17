from pydantic import BaseModel

class InstrumentCreate(BaseModel):
    instrument_id: str
    instrument_name: str
    instrument_type: str
    serial_number: str
    manufacturer: str
    status: str