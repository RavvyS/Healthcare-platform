# Project Overview

## Title

AI-Enabled Smart Healthcare Appointment and Telemedicine Platform using Microservices

## Problem Statement

Traditional healthcare booking systems often separate appointment scheduling, payment, records, and online consultation experiences. This project proposes a unified smart healthcare platform where patients can discover doctors, book appointments, complete secure payment, upload records, receive prescriptions, and attend remote consultations through one web application.

## Proposed Solution

The platform is designed as a cloud-native microservices system. Each business capability is isolated into an independent service so that the solution can scale, be deployed independently, and be maintained by a small team more effectively.

## Services Included

### 1. Auth Service

- Handles patient, doctor, and admin registration/login
- Issues JWT tokens
- Maintains user role information

### 2. Doctor Service

- Stores doctor profiles
- Manages availability schedules
- Allows appointment review and prescription issuing

### 3. Appointment Service

- Accepts booking requests
- Prevents duplicate slot reservations
- Tracks booking lifecycle using statuses
- Supports cancellation and doctor-side updates

### 4. Payment Service

- Generates payment hashes for sandbox payment gateway integration
- Supports a secure checkout flow design

### 5. Telemedicine Service

- Generates secure Jitsi-based consultation session links
- Keeps video integration separated from core booking logic

### 6. Patient Service

- Manages patient profile details
- Stores uploaded medical report metadata
- Supports patient medical record viewing

### 7. AI Symptom Checker Service

- Accepts free-text symptoms and severity
- Returns preliminary urgency guidance
- Suggests a suitable doctor specialty

### 8. Notification Service

- Records platform notifications for patients and doctors
- Supports email/SMS-style workflow integration

### 9. Frontend Client

- React-based asynchronous UI
- Patient and doctor views
- Booking workflow, appointment history, medical records, admin tools, and consultation launch support

## Assignment Requirement Mapping

| Requirement | Current Coverage |
| --- | --- |
| Web/mobile-like interface | React responsive frontend |
| Patient role | Booking, appointment tracking, consultation join flow |
| Doctor role | Appointment review, availability, prescription support |
| Admin role | Implemented with account management and doctor verification dashboard |
| Appointment service | Implemented |
| Telemedicine service | Implemented using Jitsi URL generation |
| Payment service | Implemented using PayHere-style hash generation |
| Patient management service | Implemented |
| Notification service | Implemented as a lightweight service |
| AI symptom checker | Implemented with rule-based AI assistance |
| Security/authentication | JWT-based auth service |
| Docker | Implemented |
| Kubernetes | Implemented with deployment manifests |

## Optional Enhancements For Viva Discussion

- API gateway and service discovery
- Audit logs and admin financial dashboard

## Technology Stack

- Frontend: React + Vite
- Backend: Spring Boot, Spring Web, Spring Data JPA, Spring Security
- Database: PostgreSQL
- Containerization: Docker
- Orchestration: Kubernetes
- Video integration: Jitsi Meet
- Payment integration: PayHere sandbox approach

## Why Microservices

- Independent deployment of features
- Better team collaboration for a group project
- Easier scaling of high-traffic services like appointments and telemedicine
- Clear separation of concerns for backend modules

## Future Improvements

- Add an API gateway
- Add centralized logging and monitoring
- Add notification and patient-record services
- Introduce AI symptom analysis with model guardrails
- Enforce stronger inter-service security with service tokens
