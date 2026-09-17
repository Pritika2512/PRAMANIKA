import os
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import hashlib
import uuid

from app.database import Base, engine, SessionLocal
from app.models.instrument import Instrument
from app.models.inspection import Inspection
from app.models.certificate import Certificate
from app.models.verification import Verification
from app.schemas.instrument import InstrumentCreate
from app.schemas.inspection import InspectionCreate
from app.schemas.certificate import CertificateCreate
from app.schemas.verification import VerificationCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pramaanika API", version="1.0.0")
cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(Instrument).count() == 0:
            rows = [
                ("INS-2026-00125","WEIGHING_SCALE","Essae-Teraoka","DS-252","ET252-MH-88421","30 kg","5 g","Shree Ganesh Kirana","9820418762","Mumbai, Maharashtra","Dadar West, Mumbai, Maharashtra 400028","VERIFIED","2026-09-01"),
                ("INS-2026-00124","VOLUME_MEASURING","Gilbarco","Encore 700","GVR-DL-61023","50 L/min","0.5%","Bharat Fuel Centre","9810844129","New Delhi, Delhi","Pusa Road, New Delhi 110005","PENDING","2026-08-30"),
                ("INS-2026-00123","WEIGHING_MACHINE","Avery India","L225","AVI-KA-77190","500 kg","100 g","Nandi Logistics","9845021967","Bengaluru, Karnataka","Peenya Industrial Area, Bengaluru 560058","VERIFIED","2026-08-28"),
                ("INS-2026-00122","WEIGHING_MACHINE","Mettler Toledo","VTS231","MT-GJ-20318","80 tonne","20 kg","Ambika Steel Traders","9904362881","Ahmedabad, Gujarat","Naroda GIDC, Ahmedabad 382330","EXPIRED","2026-08-24"),
                ("INS-2026-00121","LENGTH_MEASURING","Freemans","Pro-L50","FM-TN-94812","50 m","1 mm","Chennai Textile Mart","9884133502","Chennai, Tamil Nadu","T. Nagar, Chennai 600017","FAILED","2026-08-20"),
                ("INS-2026-00120","WEIGHING_SCALE","Citizen Scales","CTG-6","CT-UP-68145","6 kg","1 g","Aarav Jewellers","9415077210","Lucknow, Uttar Pradesh","Hazratganj, Lucknow 226001","VERIFIED","2026-07-26"),
                ("INS-2026-00119","MEASURING_METER","Kranti","KWM-20","KW-RJ-55091","20 mm","Class B","Jaipur Municipal Supply","9928018463","Jaipur, Rajasthan","JLN Marg, Jaipur 302001","PENDING","2026-07-22"),
                ("INS-2026-00118","OTHER","BPL Medical","AccuTemp","BPL-WB-31407","32–43 °C","0.1 °C","Swasthya Diagnostics","9831044882","Kolkata, West Bengal","Salt Lake, Kolkata 700064","VERIFIED","2026-06-21"),
                ("INS-2026-00117","WEIGHING_SCALE","Contech","CAS-30","CI-MP-42017","30 kg","5 g","Narmada General Store","9893276114","Indore, Madhya Pradesh","Vijay Nagar, Indore 452010","EXPIRED","2026-06-18"),
                ("INS-2026-00116","MEASURING_METER","Super Meter","SMC-D2","SM-KL-28351","Digital fare","1%","Kochi City Taxi Union","9746019281","Kochi, Kerala","Ernakulam South, Kochi 682016","VERIFIED","2026-05-18"),
            ]
            for r in rows:
                db.add(Instrument(instrument_id=r[0], instrument_type=r[1], manufacturer=r[2], model=r[3], serial_number=r[4], capacity=r[5], accuracy=r[6], owner=r[7], phone=r[8], location=r[9], address=r[10], status=r[11], created_at=r[12], instrument_name=r[3]))
            db.commit()
        if db.query(Inspection).count() == 0:
            rows = [
                ("INSP-2026-001","INS-2026-00125","Rajesh Kumar","2026-09-01","PASS","PASS","PASS","PASS","PASSED","Instrument found accurate and compliant.","12","2027-09-01"),
                ("INSP-2026-002","INS-2026-00124","Priya Sharma","2026-08-30","PASS","PASS","PASS","FAIL","FAILED","Required compliance marking was not satisfactory.","12",None),
                ("INSP-2026-003","INS-2026-00123","Amit Verma","2026-08-28","PASS","PASS","PASS","PASS","PASSED","All prescribed checks completed successfully.","12","2027-08-28"),
                ("INSP-2026-004","INS-2026-00122","Neha Singh","2026-08-24","FAIL","PASS","PASS","PASS","FAILED","Accuracy deviation exceeded the permitted tolerance.","12",None),
                ("INSP-2026-005","INS-2026-00120","Rajesh Kumar","2026-07-26","PASS","PASS","PASS","PASS","PASSED","Verification completed without observations.","12","2027-07-26"),
                ("INSP-2026-006","INS-2026-00119","Priya Sharma","2026-07-22","PASS","FAIL","PASS","PASS","FAILED","Seal condition requires corrective action.","12",None),
                ("INSP-2026-007","INS-2026-00118","Amit Verma","2026-06-21","PASS","PASS","PASS","PASS","PASSED","Instrument meets verification requirements.","12","2027-06-21"),
                ("INSP-2026-008","INS-2026-00117","Neha Singh","2026-06-18","PASS","PASS","FAIL","PASS","FAILED","Physical condition requires maintenance.","12",None),
            ]
            for r in rows:
                db.add(Inspection(inspection_id=r[0], instrument_id=r[1], inspector_name=r[2], inspection_date=r[3], accuracy=r[4], seal=r[5], physical=r[6], compliance=r[7], result=r[8], remarks=r[9], validity_months=r[10], valid_until=r[11]))
            db.commit()
        if db.query(Certificate).count() == 0:
            rows = [
                ("CERT-2026-00125","INS-2026-00125","2026-09-01","2027-08-31","Rajesh Kumar","INSP-2026-001"),
                ("CERT-2026-00124","INS-2026-00123","2026-08-29","2027-08-28","Priya Sharma","INSP-2026-003"),
                ("CERT-2026-00123","INS-2026-00120","2026-08-22","2027-08-21","Rajesh Kumar","INSP-2026-005"),
                ("CERT-2026-00122","INS-2026-00118","2026-08-18","2027-08-17","Amit Verma","INSP-2026-007"),
            ]
            for r in rows:
                db.add(Certificate(certificate_number=r[0], instrument_id=r[1], issue_date=r[2], expiry_date=r[3], status="ACTIVE", inspector=r[4], inspection_id=r[5], blockchain_status="PENDING", certificate_hash="—", transaction_id="—"))
            db.commit()
        if db.query(Verification).count() == 0:
            certs = db.query(Certificate).order_by(Certificate.id.asc()).all()
            for idx, cert in enumerate(certs, start=1):
                db.add(Verification(verification_id=f"VER-2026-{520+idx:05d}", certificate_number=cert.certificate_number, instrument_id=cert.instrument_id, verified_by=cert.inspector or "Public verifier", verification_date=cert.issue_date, result="VERIFIED" if cert.status == "ACTIVE" else "INVALID", blockchain_status="PENDING", transaction_id="—"))
            db.commit()
    finally:
        db.close()


seed_demo_data()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def instrument_dict(x):
    return {
        "id": x.instrument_id, "type": x.instrument_type, "manufacturer": x.manufacturer,
        "model": x.model, "serialNumber": x.serial_number, "capacity": x.capacity,
        "accuracy": x.accuracy, "owner": x.owner, "phone": x.phone, "location": x.location,
        "address": x.address, "status": x.status, "createdAt": x.created_at,
    }


def inspection_dict(x):
    return {
        "id": x.inspection_id, "instrumentId": x.instrument_id, "inspector": x.inspector_name,
        "date": x.inspection_date, "accuracy": x.accuracy, "seal": x.seal,
        "physical": x.physical, "compliance": x.compliance, "result": x.result,
        "remarks": x.remarks or "", "validityMonths": x.validity_months or "12",
        "validUntil": x.valid_until,
    }


def certificate_dict(x):
    return {
        "id": x.certificate_number, "instrumentId": x.instrument_id, "issueDate": x.issue_date,
        "validUntil": x.expiry_date, "status": x.status, "inspector": x.inspector or "—",
        "blockchainStatus": x.blockchain_status or "PENDING", "hash": x.certificate_hash or "—",
        "transactionId": x.transaction_id or "—", "inspectionId": x.inspection_id,
    }


def verification_dict(x):
    return {
        "id": x.verification_id, "certificateId": x.certificate_number,
        "instrumentId": x.instrument_id, "inspector": x.verified_by,
        "date": x.verification_date, "result": x.result,
        "blockchainStatus": x.blockchain_status or "PENDING",
        "transactionId": x.transaction_id or "—",
    }

def generate_certificate_hash(
    certificate_number,
    instrument_id,
    issue_date,
    expiry_date,
):
    data = (
        f"{certificate_number}"
        f"{instrument_id}"
        f"{issue_date}"
        f"{expiry_date}"
    )

    return hashlib.sha256(data.encode()).hexdigest()


def store_on_blockchain(certificate_hash):
    transaction_id = "TXN-" + str(uuid.uuid4())[:12]

    return {
        "success": True,
        "transaction_id": transaction_id,
        "hash": certificate_hash,
    }


@app.get("/")
def root():
    return {"message": "Pramaanika Backend Running"}

@app.get("/")
def root():
    return {"message": "Pramaanika Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/instruments")
def get_instruments(db: Session = Depends(get_db)):
    return [instrument_dict(x) for x in db.query(Instrument).order_by(Instrument.id.desc()).all()]


@app.get("/instruments/{instrument_id}")
def get_instrument(instrument_id: str, db: Session = Depends(get_db)):
    x = db.query(Instrument).filter(Instrument.instrument_id == instrument_id).first()
    if not x: raise HTTPException(404, "Instrument not found.")
    return instrument_dict(x)


@app.get("/public/instruments/{instrument_id}")
def get_public_instrument(instrument_id: str, db: Session = Depends(get_db)):
    return get_instrument(instrument_id, db)


@app.post("/instruments")
def create_instrument(payload: InstrumentCreate, db: Session = Depends(get_db)):
    instrument_id = payload.id or f"INS-2026-{(db.query(Instrument).count() + 1):05d}"
    if db.query(Instrument).filter(Instrument.instrument_id == instrument_id).first():
        raise HTTPException(409, "Instrument ID already exists.")
    if db.query(Instrument).filter(func.lower(Instrument.serial_number) == payload.serialNumber.strip().lower()).first():
        raise HTTPException(409, "This serial number is already registered.")
    x = Instrument(
        instrument_id=instrument_id, instrument_name=payload.instrument_name or payload.model,
        instrument_type=payload.type or payload.instrumentType or "OTHER", manufacturer=payload.manufacturer,
        model=payload.model, serial_number=payload.serialNumber, capacity=payload.capacity,
        accuracy=payload.accuracy, owner=payload.owner, phone=payload.phone, location=payload.location,
        address=payload.address, status=payload.status, created_at=payload.createdAt or date.today().isoformat(),
    )
    db.add(x); db.commit(); db.refresh(x)
    return instrument_dict(x)


@app.put("/instruments/{instrument_id}")
def update_instrument(instrument_id: str, payload: InstrumentCreate, db: Session = Depends(get_db)):
    x = db.query(Instrument).filter(Instrument.instrument_id == instrument_id).first()
    if not x: raise HTTPException(404, "Instrument not found.")
    for field, value in {
        "instrument_type": payload.type or payload.instrumentType, "manufacturer": payload.manufacturer,
        "model": payload.model, "serial_number": payload.serialNumber, "capacity": payload.capacity,
        "accuracy": payload.accuracy, "owner": payload.owner, "phone": payload.phone,
        "location": payload.location, "address": payload.address,
    }.items():
        if value is not None: setattr(x, field, value)
    db.commit(); db.refresh(x)
    return instrument_dict(x)


@app.get("/inspections")
def get_inspections(db: Session = Depends(get_db)):
    return [inspection_dict(x) for x in db.query(Inspection).order_by(Inspection.id.desc()).all()]


@app.get("/inspections/{inspection_id}")
def get_inspection(inspection_id: str, db: Session = Depends(get_db)):
    x = db.query(Inspection).filter(Inspection.inspection_id == inspection_id).first()
    if not x: raise HTTPException(404, "Inspection not found.")
    return inspection_dict(x)


@app.post("/inspections")
def create_inspection(payload: InspectionCreate, db: Session = Depends(get_db)):
    if not db.query(Instrument).filter(Instrument.instrument_id == payload.instrumentId).first():
        raise HTTPException(404, "Instrument not found.")
    result = payload.result or ("PASSED" if all(v == "PASS" for v in [payload.accuracy, payload.seal, payload.physical, payload.compliance]) else "FAILED")
    number = db.query(Inspection).count() + 1
    inspection_id = f"INSP-2026-{number:03d}"
    valid_until = payload.validUntil
    if not valid_until and result == "PASSED":
        from datetime import datetime
        d = datetime.fromisoformat(payload.date)
        months = int(payload.validityMonths or "12")
        month = d.month - 1 + months
        year = d.year + month // 12
        month = month % 12 + 1
        import calendar
        day = min(d.day, calendar.monthrange(year, month)[1])
        valid_until = date(year, month, day).isoformat()
    x = Inspection(
        inspection_id=inspection_id, instrument_id=payload.instrumentId, inspection_date=payload.date,
        inspector_name=payload.inspector or payload.inspector_name or "Inspector", accuracy=payload.accuracy,
        seal=payload.seal, physical=payload.physical, compliance=payload.compliance, result=result,
        remarks=payload.remarks, validity_months=payload.validityMonths, valid_until=valid_until,
    )
    db.add(x)
    instrument = db.query(Instrument).filter(Instrument.instrument_id == payload.instrumentId).first()
    instrument.status = "VERIFIED" if result == "PASSED" else "FAILED"
    db.commit(); db.refresh(x)
    return inspection_dict(x)


@app.get("/certificates")
def get_certificates(db: Session = Depends(get_db)):
    return [certificate_dict(x) for x in db.query(Certificate).order_by(Certificate.id.desc()).all()]


@app.get("/certificates/{certificate_id}")
def get_certificate(certificate_id: str, db: Session = Depends(get_db)):
    x = db.query(Certificate).filter(Certificate.certificate_number == certificate_id).first()
    if not x: raise HTTPException(404, "Certificate not found.")
    return certificate_dict(x)


@app.get("/public/certificates/{certificate_id}")
def get_public_certificate(certificate_id: str, db: Session = Depends(get_db)):
    return get_certificate(certificate_id, db)


@app.get("/certificates/by-inspection/{inspection_id}")
def get_certificate_by_inspection(inspection_id: str, db: Session = Depends(get_db)):
    x = db.query(Certificate).filter(Certificate.inspection_id == inspection_id).first()
    if not x:
        inspection = db.query(Inspection).filter(Inspection.inspection_id == inspection_id).first()
        if inspection: x = db.query(Certificate).filter(Certificate.instrument_id == inspection.instrument_id, Certificate.status == "ACTIVE").first()
    if not x: raise HTTPException(404, "Certificate not found for this inspection.")
    return certificate_dict(x)


@app.post("/certificates")
def create_certificate(
    payload: CertificateCreate,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Certificate)
        .filter(
            Certificate.certificate_number
            == payload.certificate_number
        )
        .first()
    )

    if existing:
        return certificate_dict(existing)

    certificate_hash = generate_certificate_hash(
        payload.certificate_number,
        payload.instrument_id,
        payload.issue_date,
        payload.expiry_date,
    )

    blockchain_result = store_on_blockchain(
        certificate_hash
    )

    x = Certificate(
        certificate_number=payload.certificate_number,
        instrument_id=payload.instrument_id,
        issue_date=payload.issue_date,
        expiry_date=payload.expiry_date,
        status=payload.status,
        inspector=payload.inspector or "Inspector",
        inspection_id=payload.inspection_id,

        blockchain_status="VERIFIED",
        certificate_hash=certificate_hash,
        transaction_id=blockchain_result["transaction_id"],
    )

    db.add(x)
    db.commit()
    db.refresh(x)

    return certificate_dict(x)


@app.get("/verifications")
def get_verifications(db: Session = Depends(get_db)):
    return [verification_dict(x) for x in db.query(Verification).order_by(Verification.id.desc()).all()]


@app.post("/verifications")
def create_verification(payload: VerificationCreate, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.certificate_number == payload.certificate_number).first()
    if not cert: raise HTTPException(404, "Certificate not found.")
    number = db.query(Verification).count() + 1
    x = Verification(
        verification_id=f"VER-2026-{number:05d}", certificate_number=cert.certificate_number,
        instrument_id=cert.instrument_id, verified_by=payload.verified_by,
        verification_date=payload.verification_date, result="VERIFIED" if cert.status == "ACTIVE" else "INVALID",
        blockchain_status="PENDING", transaction_id="—",
    )
    db.add(x); db.commit(); db.refresh(x)
    return verification_dict(x)


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    instruments = db.query(Instrument).all()
    statuses = ["VERIFIED", "PENDING", "EXPIRED", "FAILED"]
    counts = {s: sum(1 for x in instruments if x.status == s) for s in statuses}
    inspections = db.query(Inspection).order_by(Inspection.id.desc()).limit(5).all()
    activities = []
    for x in inspections:
        activities.append({"id": f"ACT-INSP-{x.id}", "action": "Inspection completed", "actor": x.inspector_name, "target": x.inspection_id, "date": x.inspection_date})
    return {
        "stats": {"total": len(instruments), "verified": counts["VERIFIED"], "pending": counts["PENDING"], "attention": counts["EXPIRED"] + counts["FAILED"], "totalUsers": 0, "activeUsers": 0, "pendingUsers": 0, "admins": 0},
        "statuses": [{"name": s, "value": counts[s]} for s in statuses],
        "trend": [], "activities": activities, "recent": [instrument_dict(x) for x in instruments[:5]],
    }


@app.get("/verify/{certificate_number}")
def verify_certificate(
    certificate_number: str,
    db: Session = Depends(get_db)
):

    cert = (
        db.query(Certificate)
        .filter(
            Certificate.certificate_number
            == certificate_number
        )
        .first()
    )

    if not cert:
        return {
            "status": "Invalid",
            "message": "Certificate Not Found",
            "valid": False,
        }

    instrument = (
        db.query(Instrument)
        .filter(
            Instrument.instrument_id
            == cert.instrument_id
        )
        .first()
    )

    return {
        "status":
            "Valid"
            if cert.status == "ACTIVE"
            else "Invalid",

        "valid":
            cert.status == "ACTIVE",

        "certificate_number":
            cert.certificate_number,

        "instrument_id":
            cert.instrument_id,

        "instrument":
            instrument_dict(instrument)
            if instrument
            else None,

        "issue_date":
            cert.issue_date,

        "expiry_date":
            cert.expiry_date,

        "inspector":
            cert.inspector,

        "blockchain_status":
            cert.blockchain_status,

        "certificate_hash":
            cert.certificate_hash,

        "transaction_id":
            cert.transaction_id,
    }