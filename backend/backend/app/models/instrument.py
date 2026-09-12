from sqlalchemy import Column, Integer, String
from app.database import Base

class Instrument(Base):
    __tablename__ = "instruments"
    id = Column(Integer, primary_key=True, index=True)
    instrument_id = Column(String, unique=True, index=True)
    instrument_name = Column(String)
    instrument_type = Column(String)
    manufacturer = Column(String)
    model = Column(String)
    serial_number = Column(String, unique=True, index=True)
    capacity = Column(String)
    accuracy = Column(String)
    owner = Column(String)
    phone = Column(String)
    location = Column(String)
    address = Column(String)
    status = Column(String, default="PENDING")
    created_at = Column(String)
