from sqlalchemy import Column, Integer, String
from app.database import Base

class Verification(Base):
    __tablename__ = "verifications"
    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(String, unique=True, index=True)
    certificate_number = Column(String, index=True)
    instrument_id = Column(String)
    verified_by = Column(String)
    verification_date = Column(String)
    result = Column(String, default="VERIFIED")
    blockchain_status = Column(String, default="PENDING")
    transaction_id = Column(String, default="—")
