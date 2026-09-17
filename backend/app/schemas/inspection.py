from pydantic import BaseModel

class InspectionCreate(BaseModel):
    instrument_id: str
    inspection_date: str
    inspector_name: str
    result: str
    remarks: str