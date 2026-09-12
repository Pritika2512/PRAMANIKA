from pydantic import BaseModel

class CertificateCreate(BaseModel):
    certificate_number: str
    instrument_id: str
    issue_date: str
    expiry_date: str
    status: str = "ACTIVE"
    inspector: str | None = None
    inspection_id: str | None = None
