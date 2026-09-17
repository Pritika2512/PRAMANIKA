from sqlalchemy import Column, Integer, String
from app.database import Base

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True, index=True)
    certificate_number = Column(String, unique=True, index=True)
    instrument_id = Column(String, index=True)
    issue_date = Column(String)
    expiry_date = Column(String)
    status = Column(String, default="ACTIVE")
    inspector = Column(String)
    blockchain_status = Column(String, default="PENDING")
    certificate_hash = Column(String, default="—")
    transaction_id = Column(String, default="—")
    inspection_id = Column(String, index=True)
