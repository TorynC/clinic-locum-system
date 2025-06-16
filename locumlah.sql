--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-16 14:57:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16488)
-- Name: clinic_contact_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_contact_info (
    id uuid NOT NULL,
    address text,
    city text,
    postal integer,
    phone text,
    website text
);


ALTER TABLE public.clinic_contact_info OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16476)
-- Name: clinic_general_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_general_info (
    id uuid NOT NULL,
    type text,
    description text,
    year integer
);


ALTER TABLE public.clinic_general_info OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16500)
-- Name: clinic_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_preferences (
    id uuid NOT NULL,
    qualifications text[],
    languages text[],
    preferred_doctors_only boolean DEFAULT false,
    day_rate numeric(10,2),
    night_rate numeric(10,2),
    day_start_time time without time zone,
    day_end_time time without time zone,
    night_start_time time without time zone,
    night_end_time time without time zone
);


ALTER TABLE public.clinic_preferences OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16466)
-- Name: clinics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.clinics OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16579)
-- Name: doctor_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_profile (
    id uuid NOT NULL,
    name character varying(255),
    ic character varying(64),
    skills text[],
    languages text[],
    mmc_number character varying(64),
    apc_number character varying(64),
    specialization character varying(255),
    experience_years integer,
    bio text,
    address character varying(255),
    city character varying(255),
    state character varying(255),
    postal character varying(32),
    phone character varying(32),
    email character varying(255),
    gender character varying(32),
    birthday date,
    minimum_pay integer,
    preferred_days text[],
    earliest_start time without time zone,
    latest_end time without time zone,
    max_distance integer,
    email_notif boolean,
    sms_notif boolean
);


ALTER TABLE public.doctor_profile OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16571)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    email character varying(255),
    password character varying(255)
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16555)
-- Name: manual_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manual_jobs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clinic_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    procedure character varying(255),
    description text,
    incentives text,
    day_rate numeric(10,2),
    night_rate numeric(10,2),
    total_pay numeric(10,2),
    date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    gender character varying(50),
    languages character varying(50)[],
    preferred_doctors boolean DEFAULT false,
    paid_break boolean DEFAULT false,
    start_day_time time without time zone,
    end_day_time time without time zone,
    start_night_time time without time zone,
    end_night_time time without time zone,
    contact character varying(100),
    special_instructions text,
    email character varying(255),
    address text,
    phone character varying(20),
    status character varying(20)
);


ALTER TABLE public.manual_jobs OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 16488)
-- Dependencies: 221
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_contact_info (id, address, city, postal, phone, website) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	Ipoh	31400	05-5465135	pfpipohklinik.com.my
3774dfed-adae-4f6d-97c5-30bdc05237f5	jalan mutaiara seputeh	Kuala Lumpur	58000	0123912619	www.cityclinichostpial.com
\.


--
-- TOC entry 4985 (class 0 OID 16476)
-- Dependencies: 220
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_general_info (id, type, description, year) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	hospital	City Medical Clinic provides comprehensive healthcare services to the community with a focus on family medicine and preventive care. \nwe are determined to provide the best healthcare possible at an affordable rate for everyone	1973
0360be22-7d2d-4a97-a684-46c10e58fa92	medical	A 24 hours Ipoh clinic started in April 1984, Klinik Ipoh PFP 24 Jam was the first private GP clinic in the famous medical street that was Jalan Fairpark (Now Jalan Kamarudin Isa)\n\nSituated between the Ipoh GH and the Ipoh Stadium Complex, this Ipoh clinic as well as their doctors have built up a strong following of locals as well as outstation clients who come for their effective treatment methods at fair prices. Even as the GST has increased operating costs significantly, PFP charges have remained unchanged.	1984
\.


--
-- TOC entry 4987 (class 0 OID 16500)
-- Dependencies: 222
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_preferences (id, qualifications, languages, preferred_doctors_only, day_rate, night_rate, day_start_time, day_end_time, night_start_time, night_end_time) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	{"General Practice",Dental,Surgery}	{Mandarin,English,Malay,Tamil}	t	45.20	70.30	09:00:00	21:00:00	21:00:00	03:30:00
0360be22-7d2d-4a97-a684-46c10e58fa92	{Emergency,Pediatrics,"General Practice",Dental}	{English,Mandarin,Malay,Tamil,Other}	f	40.50	50.00	09:00:00	16:00:00	16:00:00	21:00:00
\.


--
-- TOC entry 4984 (class 0 OID 16466)
-- Dependencies: 219
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, clinic_name, email, password) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	clinic	clinic2@gmail.com	$2b$10$BLsLfU7l1RRKLRtLC3rAneTrgujieMY0hPflNja3JfNJTVMZO4NU6
8c677fab-6ec3-4c2c-96b3-47d8c0862707	KL hospital	KL@gmail.com	$2b$10$yIrIUP.tRFQvUCMTqd9sku.bx1i6TgHrXX8JsUI4rAqWPz/dAY0EC
8666f8e6-82d9-46dc-9a33-f128b7e42e89	KL2 hospital	KL2@gmail.com	$2b$10$gWCfmJ6d0IlwvhyLELWuluANjiNEZaxrdb5apLeqG/Gd9q5rNu9I.
0360be22-7d2d-4a97-a684-46c10e58fa92	Poliklinik Fair Park	info@pfpipohklinik.com.my	$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG
\.


--
-- TOC entry 4990 (class 0 OID 16579)
-- Dependencies: 225
-- Data for Name: doctor_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_profile (id, name, ic, skills, languages, mmc_number, apc_number, specialization, experience_years, bio, address, city, state, postal, phone, email, gender, birthday, minimum_pay, preferred_days, earliest_start, latest_end, max_distance, email_notif, sms_notif) FROM stdin;
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	Dr. Jane Doe	900101-14-5678	{diagnosis}	{English,Malay}	MMC123456	APC654321	General Practice	5	Experienced GP with a passion for rural healthcare.	123 Main Street	Kuala Lumpur	Wilayah Persekutuan	50000	0123456789	jane.doe@example.com	Female	1990-01-01	200	{Monday,Wednesday,Friday}	08:00:00	18:00:00	20	t	f
\.


--
-- TOC entry 4989 (class 0 OID 16571)
-- Dependencies: 224
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, name, email, password) FROM stdin;
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	James Chong	james@gmail.com	$2b$10$h7BVMx8pb8BaYE4ZyMoriONYHNfBLUaGp0pjJmqO3XDKVK9kjD2Ii
\.


--
-- TOC entry 4988 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: manual_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manual_jobs (id, clinic_id, title, procedure, description, incentives, day_rate, night_rate, total_pay, date, start_time, end_time, gender, languages, preferred_doctors, paid_break, start_day_time, end_day_time, start_night_time, end_night_time, contact, special_instructions, email, address, phone, status) FROM stdin;
ca02ac29-a3dc-4330-841d-768d2934f411	0360be22-7d2d-4a97-a684-46c10e58fa92	Specialist Locum 2	Emergency	Emergency care of patients	RM1/patient	20.50	50.90	463.99	2025-06-17	09:00:00	23:00:00	any	{English}	\N	t	09:00:00	17:09:00	17:10:00	23:00:00	Dr. Jane Smith	special instruction 	ipohclinic@gmail.com	ipoh 22	0122223338	posted
10197c55-8e4d-468b-8678-dab6dafd76ea	0360be22-7d2d-4a97-a684-46c10e58fa92	General practitioner locum	General Practice	Provide General Consultation to patients while doctor is currently away 		40.50	50.00	489.04	2025-06-19	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
558e000f-9efb-408d-879d-b240c2de03d2	0360be22-7d2d-4a97-a684-46c10e58fa92	Nurse Locum	General Practice			25.00	29.00	293.33	2025-06-19	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
6cde92e3-c31d-4d2f-936c-f281b80342e8	0360be22-7d2d-4a97-a684-46c10e58fa92	Admin Staff Locum	General Practice			25.00	29.00	293.33	2025-06-14	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
693bf61f-ac19-4e5a-9003-1cb56c5c97a8	0360be22-7d2d-4a97-a684-46c10e58fa92	Admin Staff Locum	General Practice			25.00	29.00	293.33	2025-06-15	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
4b06bb2b-53ef-40e2-83d4-cdd94517083d	0360be22-7d2d-4a97-a684-46c10e58fa92	Admin Staff Locum	General Practice			25.00	29.00	293.33	2025-06-16	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
6e434a68-5a7b-4665-8076-e32d1b53d641	0360be22-7d2d-4a97-a684-46c10e58fa92	General practitioner locum	General Practice			56.00	59.00	629.75	2025-06-21	09:00:00	21:00:00	male	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
7480e278-cdd8-4bf7-ba93-f6855035d4f6	0360be22-7d2d-4a97-a684-46c10e58fa92	Specialist Locum	Emergency			40.50	50.00	489.04	2025-06-14	09:00:00	21:00:00		{}	f	f	09:00:00	16:00:00	16:00:00	21:00:00			info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
8c46e7d8-014c-4ce9-9878-9b302ead97cb	0360be22-7d2d-4a97-a684-46c10e58fa92	General practitioner locum	General Practice			56.00	59.00	629.75	2025-06-23	09:00:00	21:00:00	female	{English,Malay,Mandarin}	\N	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Jane Smith		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted
\.


--
-- TOC entry 4826 (class 2606 OID 16494)
-- Name: clinic_contact_info clinic_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 16482)
-- Name: clinic_general_info clinic_general_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16507)
-- Name: clinic_preferences clinic_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 16475)
-- Name: clinics clinics_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_email_key UNIQUE (email);


--
-- TOC entry 4822 (class 2606 OID 16473)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16585)
-- Name: doctor_profile doctor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16578)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16564)
-- Name: manual_jobs manual_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_jobs
    ADD CONSTRAINT manual_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16495)
-- Name: clinic_contact_info clinic_contact_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 16483)
-- Name: clinic_general_info clinic_general_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 16508)
-- Name: clinic_preferences clinic_preferences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 16586)
-- Name: doctor_profile doctor_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_id_fkey FOREIGN KEY (id) REFERENCES public.doctors(id);


-- Completed on 2025-06-16 14:57:32

--
-- PostgreSQL database dump complete
--

