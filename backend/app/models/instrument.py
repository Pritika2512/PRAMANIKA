from sqlalchemy import Column, Integer, String
from app.database import Base

class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(Integer, primary_key=True, index=True)
    instrument_id = Column(String, unique=True)
    instrument_name = Column(String)
    instrument_type = Column(String)
    serial_number = Column(String)
    manufacturer = Column(String)
    status = Column(String)