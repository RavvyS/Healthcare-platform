# MediCare Smart Healthcare Platform

MediCare is a cloud-native healthcare appointment and telemedicine platform designed for the "AI-Enabled Smart Healthcare Appointment & Telemedicine Platform using Microservices" assignment. The system follows a microservices architecture and includes a React frontend, Spring Boot backend services, Docker-based local orchestration, and Kubernetes manifests for deployment.

## Core Features

- Patient-facing web interface for browsing doctors, booking appointments, tracking bookings, and joining video consultations
- Doctor-facing dashboard for reviewing appointment requests and managing consultation flow
- Admin dashboard for doctor verification, user operations, and notification visibility
- JWT-based authentication service with role support for `PATIENT`, `DOCTOR`, and `ADMIN`
- Doctor management service for doctor profiles, availability, appointments, and digital prescriptions
- Appointment management service with payment initialization, status tracking, slot validation, and cancellation
- Patient management service for profile maintenance and medical report history
- Telemedicine service with Jitsi Meet session link generation
- Payment service prepared for PayHere-style hash generation in sandbox mode
- AI symptom checker service for specialty suggestions and urgency guidance
- Notification service for appointment and workflow alerts
- Docker Compose setup for local multi-service execution
- Kubernetes manifests for containerized deployment

## Microservices

| Service | Port | Responsibility |
| --- | --- | --- |
| Frontend | 5173 | React web client |
| Auth Service | 8081 | Registration, login, JWT issuance, role identity |
| Doctor Service | 8082 | Doctor profiles, availability, appointments, prescriptions |
| Appointment Service | 8083 | Booking flow, slot checks, payment initialization, status updates |
| Payment Service | 8084 | Payment hash generation for sandbox payments |
| Telemedicine Service | 8085 | Secure Jitsi session URL generation |
| Patient Service | 8086 | Patient profile, report upload metadata, medical records |
| AI Symptom Service | 8087 | Preliminary symptom analysis and specialty recommendation |
| Notification Service | 8088 | SMS/email-style notification logging and delivery stubs |
| PostgreSQL | 5432 | Shared database server with separate service databases |

## Architecture Summary

- Frontend communicates asynchronously with REST APIs.
- Each backend capability is separated into an independent Spring Boot service.
- PostgreSQL stores service data in separate databases.
- Docker Compose is provided for local integration testing.
- Kubernetes manifests are included for deployment demonstration.

Detailed assignment mapping is available in [docs/project-overview.md](/Users/ravindusandun/Downloads/Ds-2/Healthcare-platform/docs/project-overview.md).

## Repository Structure

```text
.
├── frontend/
├── services/
│   ├── auth-service/
│   ├── doctor-service/
│   ├── appointment-service/
│   ├── payment-service/
│   └── telemedicine-service/
│   ├── patient-service/
│   ├── ai-symptom-service/
│   └── notification-service/
├── docker/
├── kubernetes/
├── docs/
└── submission.txt
```

## Run With Docker Compose

1. Make sure Docker Desktop is running.
2. From the project root, run:

```bash
docker compose -f docker/docker-compose.yml up --build
```

3. Open the frontend at `http://localhost:5173`.

## Kubernetes Deployment

Apply the manifests from the project root:

```bash
kubectl apply -f kubernetes/
```

This creates:

- PostgreSQL deployment and service
- Deployments and services for all backend microservices
- Frontend deployment and service

## Suggested Demo Flow

1. Register or log in through the auth service.
2. Browse doctors and select a consultation slot.
3. Initialize payment and confirm the booking.
4. View booked appointments as a patient.
5. Review appointments as a doctor and update their status.
6. Launch a telemedicine session through the generated Jitsi link.

## Notes For Submission

- Replace the placeholder repository URL in [submission.txt](/Users/ravindusandun/Downloads/Ds-2/Healthcare-platform/submission.txt) before final submission.
- If your lecturer asks for report content, use [docs/project-overview.md](/Users/ravindusandun/Downloads/Ds-2/Healthcare-platform/docs/project-overview.md) as the base.
