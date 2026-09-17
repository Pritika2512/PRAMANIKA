from sqlalchemy import Column, Integer, String
from app.database import Base

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    certificate_number = Column(String)
    verified_by = Column(String)
    verification_date = Column(String)