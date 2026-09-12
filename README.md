# Pramaanika

### Online Verification & Digital Certification System for Weighing and Measuring Instruments

Pramaanika is a digital platform designed to modernize the verification, certification, and lifecycle management of weighing and measuring instruments under the Legal Metrology ecosystem.

The platform brings instrument registration, verification workflows, inspections, digital certificates, QR-based verification, verification history, monitoring, and administrative operations into a unified system.

---

## 📌 Problem Statement

Verification of weighing and measuring instruments involves several activities such as application submission, scheduling, physical inspection, recording observations, issuing certificates, maintaining records, and monitoring verification validity.

Traditional or fragmented processes can result in:

- Manual paperwork
- Delays in verification
- Difficulty tracking verification status
- Fragmented records
- Limited transparency
- Difficulty monitoring certificate validity
- Challenges in quickly authenticating certificates

Pramaanika aims to provide a centralized digital workflow for these activities.

---

## 💡 Our Solution

Pramaanika provides a unified web-based platform for stakeholders involved in Legal Metrology verification.

The system enables:

- Digital stakeholder registration
- Instrument registration and management
- Online verification and re-verification workflows
- Inspection recording
- Verification scheduling
- Digital certificate generation
- QR-based certificate verification
- Verification history
- Certificate validity tracking
- Alerts and notifications
- Dashboards and monitoring
- Role-based access
- Centralized digital records

---

# 🎯 Key Features

## 👤 User & Role Management

- User registration and login
- Role-based access
- Inspector workspace
- Administrator workspace
- User management

---

## ⚖️ Instrument Management

- Register weighing and measuring instruments
- Store instrument specifications
- Store owner information
- Search and filter instruments
- Track verification status
- View instrument details
- Track certificate validity

---

## 🔍 Inspection Management

- Create inspection records
- Select registered instruments
- Record inspection date
- Perform accuracy checks
- Check seals
- Record physical condition
- Check standard compliance
- Record remarks
- Determine inspection result
- Define certificate validity

---

## 📜 Digital Certificates

Pramaanika provides a digital certificate workflow for successfully verified instruments.

Certificates contain information such as:

- Certificate ID
- Instrument details
- Owner details
- Verification date
- Validity period
- Inspector information
- Verification status
- QR verification information

Certificates can also be previewed, printed, and downloaded through the frontend.

---

## 📱 QR-Based Verification

Each digital verification certificate can be associated with a QR code.

The public verification workflow allows users to check certificate authenticity without requiring access to the internal dashboard.

Possible verification states include:

- ✅ Verified
- ❌ Not Verified
- ⚠️ Tampering Detected

This helps improve transparency and public confidence in verification records.

---

## 🧾 Verification History

The platform maintains verification activity records including:

- Verification ID
- Certificate ID
- Instrument ID
- Inspector
- Verification date
- Verification result
- Blockchain status

Search and filtering capabilities allow authorized users to retrieve previous verification records.

---

## 🔔 Notifications & Alerts

The system can provide notifications related to:

- Certificate expiry
- Verification completion
- Pending verification
- Instrument registration
- Other important workflow events

---

## 📊 Dashboard & Monitoring

Dashboards provide an overview of verification activities.

Monitoring information can include:

- Total instruments
- Verified instruments
- Pending verification
- Expired certificates
- Recent inspections
- Verification status
- Verification activity

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Users          │
                    │ Businesses / LMOs   │
                    │ GATCs / Authorities │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Pramaanika Web    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │    REST APIs        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ PostgreSQL  │   │ Certificate │   │ Blockchain  │
      │  Database   │   │   System    │   │   Layer     │
      └─────────────┘   └─────────────┘   └─────────────┘
                               │
                               ▼
                      ┌────────────────┐
                      │ QR Verification│
                      │     Portal     │
                      └────────────────┘
