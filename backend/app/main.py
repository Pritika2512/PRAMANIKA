from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.models.certificate import Certificate
from app.schemas.certificate import CertificateCreate
from app.database import Base, engine, SessionLocal

from app.models.user import User
from app.models.instrument import Instrument
from app.models.inspection import Inspection

from app.schemas.instrument import InstrumentCreate
from app.schemas.inspection import InspectionCreate
from app.models.verification import Verification
from app.schemas.verification import VerificationCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pramaanika API")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Pramaanika Backend Running"}


@app.get("/users")
def get_users():
    return {"message": "Users API Working"}


#INSTRUMENTS

@app.post("/instruments")
def create_instrument(
    instrument: InstrumentCreate,
    db: Session = Depends(get_db)
):
    new_instrument = Instrument(
        instrument_id=instrument.instrument_id,
        instrument_name=instrument.instrument_name,
        instrument_type=instrument.instrument_type,
        serial_number=instrument.serial_number,
        manufacturer=instrument.manufacturer,
        status=instrument.status
    )

    db.add(new_instrument)
    db.commit()
    db.refresh(new_instrument)

    return {
        "message": "Instrument Added Successfully",
        "id": new_instrument.id
    }


@app.get("/instruments")
def get_instruments(db: Session = Depends(get_db)):
    return db.query(Instrument).all()


#INSPECTIONS

@app.post("/inspections")
def create_inspection(
    inspection: InspectionCreate,
    db: Session = Depends(get_db)
):
    new_inspection = Inspection(
        instrument_id=inspection.instrument_id,
        inspection_date=inspection.inspection_date,
        inspector_name=inspection.inspector_name,
        result=inspection.result,
        remarks=inspection.remarks
    )

    db.add(new_inspection)
    db.commit()
    db.refresh(new_inspection)

    return {
        "message": "Inspection Added Successfully",
        "id": new_inspection.id
    }


@app.get("/inspections")
def get_inspections(db: Session = Depends(get_db)):
    return db.query(Inspection).all()

#CERTIFICATES 

@app.post("/certificates")
def create_certificate(
    certificate: CertificateCreate,
    db: Session = Depends(get_db)
):
    new_certificate = Certificate(
        certificate_number=certificate.certificate_number,
        instrument_id=certificate.instrument_id,
        issue_date=certificate.issue_date,
        expiry_date=certificate.expiry_date,
        status=certificate.status
    )

    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)

    return {
        "message": "Certificate Added Successfully",
        "id": new_certificate.id
    }


@app.get("/certificates")
def get_certificates(db: Session = Depends(get_db)):
    return db.query(Certificate).all()


#VERIFICATIONS 

@app.post("/verifications")
def create_verification(
    verification: VerificationCreate,
    db: Session = Depends(get_db)
):
    new_verification = Verification(
        certificate_number=verification.certificate_number,
        verified_by=verification.verified_by,
        verification_date=verification.verification_date
    )

    db.add(new_verification)
    db.commit()
    db.refresh(new_verification)

    return {
        "message": "Verification Added Successfully",
        "id": new_verification.id
    }


@app.get("/verifications")
def get_verifications(db: Session = Depends(get_db)):
    return db.query(Verification).all()


#DASHBOARD

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return {
        "total_instruments": db.query(Instrument).count(),
        "total_inspections": db.query(Inspection).count(),
        "total_certificates": db.query(Certificate).count(),
        "total_verifications": db.query(Verification).count()
    }


#CERTIFICATE VERIFY

@app.get("/verify/{certificate_number}")
def verify_certificate(
    certificate_number: str,
    db: Session = Depends(get_db)
):
    certificate = db.query(Certificate).filter(
        Certificate.certificate_number == certificate_number
    ).first()

    if not certificate:
        return {
            "status": "Invalid",
            "message": "Certificate Not Found"
        }

    return {
        "status": "Valid",
        "certificate_number": certificate.certificate_number,
        "instrument_id": certificate.instrument_id,
        "expiry_date": certificate.expiry_date
    }
