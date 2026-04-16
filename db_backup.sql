--
-- PostgreSQL database cluster dump
--

\restrict 2NMeadDcU8axsZOQ9tvtozkVwjOtXOU31EIgfuudXCCvvfqXIvmhYkwk4GzjLe8

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE appointment_service_db;
DROP DATABASE auth_service_db;
DROP DATABASE doctor_service_db;
DROP DATABASE patient_service_db;




--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:JmVB9N30e8dOsDqaqJ0B3Q==$JlkaF/N9fitn0dXfkGs//Jnl5zo9+nwuHBIBnvceJfE=:XOgyxG1xwnM7CHA4/LywdiyHKpKUa2buw5+KAFADIdU=';

--
-- User Configurations
--








\unrestrict 2NMeadDcU8axsZOQ9tvtozkVwjOtXOU31EIgfuudXCCvvfqXIvmhYkwk4GzjLe8

--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

\restrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\unrestrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV
\connect template1
\restrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\unrestrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV
\connect template1
\restrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict wnrZN2LKPFEWHO4DAhbzsDExeZccgkPIAiSZhlfumi6PZunkFf7LagubVDDTMjV

--
-- Database "appointment_service_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 4YslRyrJR9xhjrvDPpcRz32PxOOCKndhbxBr3RTUgUZgoDKQJKYeLlL50QRsjSk

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: appointment_service_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE appointment_service_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE appointment_service_db OWNER TO postgres;

\unrestrict 4YslRyrJR9xhjrvDPpcRz32PxOOCKndhbxBr3RTUgUZgoDKQJKYeLlL50QRsjSk
\connect appointment_service_db
\restrict 4YslRyrJR9xhjrvDPpcRz32PxOOCKndhbxBr3RTUgUZgoDKQJKYeLlL50QRsjSk

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id bigint NOT NULL,
    appointment_date timestamp(6) without time zone,
    consultation_type character varying(255),
    created_at timestamp(6) without time zone,
    diagnosis character varying(255),
    doctor_id bigint,
    fee double precision,
    order_id character varying(255),
    patient_id bigint,
    prescription_id character varying(255),
    reason character varying(255),
    slot_time character varying(255),
    status character varying(255),
    updated_at timestamp(6) without time zone,
    CONSTRAINT appointments_status_check CHECK (((status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PENDING'::character varying, 'CONFIRMED'::character varying, 'CANCELLED'::character varying, 'COMPLETED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, appointment_date, consultation_type, created_at, diagnosis, doctor_id, fee, order_id, patient_id, prescription_id, reason, slot_time, status, updated_at) FROM stdin;
\.


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, false);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 4YslRyrJR9xhjrvDPpcRz32PxOOCKndhbxBr3RTUgUZgoDKQJKYeLlL50QRsjSk

--
-- Database "auth_service_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 2qO5jta3ovfpbSIJV2UdLSAb9LnQAWmaaeY5OEIpG9S7Jw63VHJ0wUqFuffpThj

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth_service_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE auth_service_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE auth_service_db OWNER TO postgres;

\unrestrict 2qO5jta3ovfpbSIJV2UdLSAb9LnQAWmaaeY5OEIpG9S7Jw63VHJ0wUqFuffpThj
\connect auth_service_db
\restrict 2qO5jta3ovfpbSIJV2UdLSAb9LnQAWmaaeY5OEIpG9S7Jw63VHJ0wUqFuffpThj

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    account_status character varying(255),
    email character varying(255),
    full_name character varying(255),
    password character varying(255),
    reset_token character varying(255),
    reset_token_expiry timestamp(6) without time zone,
    role character varying(255),
    CONSTRAINT users_account_status_check CHECK (((account_status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'PENDING_VERIFICATION'::character varying, 'SUSPENDED'::character varying])::text[]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['PATIENT'::character varying, 'DOCTOR'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, account_status, email, full_name, password, reset_token, reset_token_expiry, role) FROM stdin;
1	ACTIVE	ravindusdc@gmail.com	Ravindu Admin	$2a$10$DdV4lEbGI1a8BoPt9c/MM.YaJgPWs9Tp0SWmbD9TPDrdNLmlzaoK.	\N	\N	ADMIN
2	PENDING_VERIFICATION	patient@medicare.lk	John Doe	$2a$10$uGIcMcpkV.0gNHKDAvlv8u2H.R6TChNFseBicrNtG..fz76XmuhcO	\N	\N	PATIENT
3	PENDING_VERIFICATION	doctor@medicare.lk	Dr. Amal Perera	$2a$10$ZXfv.iMIkC45XJChy0clSeFdjoeORIeKmUI82qUCsbpjPTiFMZanO	\N	\N	DOCTOR
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2qO5jta3ovfpbSIJV2UdLSAb9LnQAWmaaeY5OEIpG9S7Jw63VHJ0wUqFuffpThj

--
-- Database "doctor_service_db" dump
--

--
-- PostgreSQL database dump
--

\restrict hAck2etBqleT5ybeYFsgblx0fVRhs5C4tkIxtURkoTx2p1EjR8t3UiQZkviVK8T

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: doctor_service_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE doctor_service_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE doctor_service_db OWNER TO postgres;

\unrestrict hAck2etBqleT5ybeYFsgblx0fVRhs5C4tkIxtURkoTx2p1EjR8t3UiQZkviVK8T
\connect doctor_service_db
\restrict hAck2etBqleT5ybeYFsgblx0fVRhs5C4tkIxtURkoTx2p1EjR8t3UiQZkviVK8T

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id bigint NOT NULL,
    consultation_type character varying(255),
    date date,
    doctor_id bigint,
    patient_id bigint,
    reason character varying(255),
    status character varying(255),
    CONSTRAINT appointments_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.availability (
    id bigint NOT NULL,
    date date,
    end_time time(6) without time zone,
    start_time time(6) without time zone,
    doctor_id bigint NOT NULL
);


ALTER TABLE public.availability OWNER TO postgres;

--
-- Name: availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.availability ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.availability_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id bigint NOT NULL,
    availability text,
    consultation_fee double precision,
    email character varying(255) NOT NULL,
    hospital character varying(255),
    name character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    specialization character varying(255) NOT NULL,
    verified boolean
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id bigint NOT NULL,
    date date,
    details text,
    doctor_id bigint,
    patient_id bigint
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.prescriptions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.prescriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, consultation_type, date, doctor_id, patient_id, reason, status) FROM stdin;
\.


--
-- Data for Name: availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.availability (id, date, end_time, start_time, doctor_id) FROM stdin;
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, availability, consultation_fee, email, hospital, name, phone, specialization, verified) FROM stdin;
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, date, details, doctor_id, patient_id) FROM stdin;
\.


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, false);


--
-- Name: availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.availability_id_seq', 1, false);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 1, false);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: availability availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: doctors ukcaifv0va46t2mu85cg5afmayf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT ukcaifv0va46t2mu85cg5afmayf UNIQUE (email);


--
-- Name: availability fklsm2d8adfkdde23pcmrru955g; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability
    ADD CONSTRAINT fklsm2d8adfkdde23pcmrru955g FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- PostgreSQL database dump complete
--

\unrestrict hAck2etBqleT5ybeYFsgblx0fVRhs5C4tkIxtURkoTx2p1EjR8t3UiQZkviVK8T

--
-- Database "patient_service_db" dump
--

--
-- PostgreSQL database dump
--

\restrict PQs2A4bWcd9L1hZvoxerWRBCWI4HRzewVX4hVca3V9oHcXBEHRGZbHfsKcha4NM

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: patient_service_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE patient_service_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE patient_service_db OWNER TO postgres;

\unrestrict PQs2A4bWcd9L1hZvoxerWRBCWI4HRzewVX4hVca3V9oHcXBEHRGZbHfsKcha4NM
\connect patient_service_db
\restrict PQs2A4bWcd9L1hZvoxerWRBCWI4HRzewVX4hVca3V9oHcXBEHRGZbHfsKcha4NM

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: medical_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_reports (
    report_id bigint NOT NULL,
    document_url character varying(255),
    notes character varying(255),
    report_name character varying(255),
    report_type character varying(255),
    uploaded_at timestamp(6) without time zone,
    patient_id bigint NOT NULL
);


ALTER TABLE public.medical_reports OWNER TO postgres;

--
-- Name: medical_reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.medical_reports ALTER COLUMN report_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.medical_reports_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: patient_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_profiles (
    patient_id bigint NOT NULL,
    address character varying(255),
    allergies character varying(255),
    blood_group character varying(255),
    email character varying(255),
    emergency_contact character varying(255),
    full_name character varying(255),
    medical_notes character varying(255),
    phone character varying(255)
);


ALTER TABLE public.patient_profiles OWNER TO postgres;

--
-- Data for Name: medical_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_reports (report_id, document_url, notes, report_name, report_type, uploaded_at, patient_id) FROM stdin;
\.


--
-- Data for Name: patient_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_profiles (patient_id, address, allergies, blood_group, email, emergency_contact, full_name, medical_notes, phone) FROM stdin;
\.


--
-- Name: medical_reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_reports_report_id_seq', 1, false);


--
-- Name: medical_reports medical_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_reports
    ADD CONSTRAINT medical_reports_pkey PRIMARY KEY (report_id);


--
-- Name: patient_profiles patient_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_profiles
    ADD CONSTRAINT patient_profiles_pkey PRIMARY KEY (patient_id);


--
-- Name: medical_reports fknfs6yculb4bcu4fqgon9hxi4p; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_reports
    ADD CONSTRAINT fknfs6yculb4bcu4fqgon9hxi4p FOREIGN KEY (patient_id) REFERENCES public.patient_profiles(patient_id);


--
-- PostgreSQL database dump complete
--

\unrestrict PQs2A4bWcd9L1hZvoxerWRBCWI4HRzewVX4hVca3V9oHcXBEHRGZbHfsKcha4NM

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

\restrict AC692z5bzT1WVBMXDB2kW7mcZGRuMK95iqfyf2FDrD2kBKKO02CFvhIVmzgO50E

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\unrestrict AC692z5bzT1WVBMXDB2kW7mcZGRuMK95iqfyf2FDrD2kBKKO02CFvhIVmzgO50E
\connect postgres
\restrict AC692z5bzT1WVBMXDB2kW7mcZGRuMK95iqfyf2FDrD2kBKKO02CFvhIVmzgO50E

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

\unrestrict AC692z5bzT1WVBMXDB2kW7mcZGRuMK95iqfyf2FDrD2kBKKO02CFvhIVmzgO50E

--
-- PostgreSQL database cluster dump complete
--

