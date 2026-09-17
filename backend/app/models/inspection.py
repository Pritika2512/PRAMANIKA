from sqlalchemy import Column, Integer, String
from app.database import Base

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    instrument_id = Column(String)
    inspection_date = Column(String)
    inspector_name = Column(String)
    result = Column(String)
    remarks = Column(String)