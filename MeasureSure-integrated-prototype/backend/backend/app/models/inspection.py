from sqlalchemy import Column, Integer, String
from app.database import Base

class Inspection(Base):
    __tablename__ = "inspections"
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(String, unique=True, index=True)
    instrument_id = Column(String, index=True)
    inspection_date = Column(String)
    inspector_name = Column(String)
    accuracy = Column(String)
    seal = Column(String)
    physical = Column(String)
    compliance = Column(String)
    result = Column(String)
    remarks = Column(String)
    validity_months = Column(String)
    valid_until = Column(String)
