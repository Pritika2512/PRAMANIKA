from pydantic import BaseModel

class VerificationCreate(BaseModel):
    certificate_number: str
    verified_by: str = "Public verifier"
    verification_date: str
