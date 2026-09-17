from sqlalchemy import Column, Integer, String
from app.database import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_number = Column(String, unique=True)
    instrument_id = Column(String)
    issue_date = Column(String)
    expiry_date = Column(String)
    status = Column(String)