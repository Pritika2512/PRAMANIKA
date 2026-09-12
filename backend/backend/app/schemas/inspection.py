from pydantic import BaseModel

class InspectionCreate(BaseModel):
    instrumentId: str
    date: str
    inspector: str | None = None
    inspector_name: str | None = None
    accuracy: str
    seal: str
    physical: str
    compliance: str
    result: str | None = None
    remarks: str = ""
    validityMonths: str = "12"
    validUntil: str | None = None
