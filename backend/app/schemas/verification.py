from pydantic import BaseModel

class VerificationCreate(BaseModel):
    certificate_number: str
    verified_by: str
    verification_date: str