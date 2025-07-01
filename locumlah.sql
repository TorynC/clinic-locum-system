--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-01 12:11:47

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
-- TOC entry 5009 (class 0 OID 0)
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
    night_end_time time without time zone,
    two_rates boolean,
    default_rate numeric,
    start_time time without time zone,
    end_time time without time zone
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
    gender character varying(32),
    birthday date,
    minimum_pay integer,
    preferred_days text[],
    earliest_start time without time zone,
    latest_end time without time zone,
    max_distance integer,
    email_notif boolean,
    sms_notif boolean,
    verified boolean,
    profile_pic text,
    mmc_file text,
    apc_file text,
    bank_number text,
    work_experience jsonb
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
-- TOC entry 227 (class 1259 OID 24592)
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    job_id uuid,
    doctor_id uuid,
    applied_at timestamp without time zone DEFAULT now(),
    status character varying(20)
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24591)
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 226
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- TOC entry 223 (class 1259 OID 16555)
-- Name: manual_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manual_jobs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clinic_id uuid NOT NULL,
    title character varying(255) NOT NULL,
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
    status character varying(20),
    procedure text[],
    rate numeric(10,2),
    two_rates boolean,
    duration integer,
    doctor_id uuid
);


ALTER TABLE public.manual_jobs OWNER TO postgres;

--
-- TOC entry 4824 (class 2604 OID 24595)
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- TOC entry 4997 (class 0 OID 16488)
-- Dependencies: 221
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_contact_info (id, address, city, postal, phone, website) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	Ipoh	31400	05-5465135	pfpipohklinik.com.my
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur	Kuala Lumpur	59200	012-901 4256	N/A
\.


--
-- TOC entry 4996 (class 0 OID 16476)
-- Dependencies: 220
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_general_info (id, type, description, year) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	medical	A 24 hours Ipoh clinic started in April 1984, Klinik Ipoh PFP 24 Jam was the first private GP clinic in the famous medical street that was Jalan Fairpark (Now Jalan Kamarudin Isa)\n\nSituated between the Ipoh GH and the Ipoh Stadium Complex, this Ipoh clinic as well as their doctors have built up a strong following of locals as well as outstation clients who come for their effective treatment methods at fair prices. Even as the GST has increased operating costs significantly, PFP charges have remained unchanged.	1984
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5		Medical Corporate Clinic. General Practice	2011
\.


--
-- TOC entry 4998 (class 0 OID 16500)
-- Dependencies: 222
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_preferences (id, qualifications, languages, preferred_doctors_only, day_rate, night_rate, day_start_time, day_end_time, night_start_time, night_end_time, two_rates, default_rate, start_time, end_time) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	{"Antenatal Care",ECG,"Paeds Care"}	{English,Malay,Mandarin}	f	30.00	30.00	09:00:00	16:00:00	16:00:00	21:00:00	f	40	09:00:00	18:00:00
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	{"General Practice"}	{English,Mandarin,Malay,Tamil}	f	45.00	35.00	09:00:00	17:00:00	17:00:00	22:00:00	\N	\N	\N	\N
\.


--
-- TOC entry 4995 (class 0 OID 16466)
-- Dependencies: 219
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, clinic_name, email, password) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	Poliklinik Fair Park	info@pfpipohklinik.com.my	$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	Klinik Oasis Bangsar South	klinikoasis@gmail.com	$2b$10$3PzRnRHF.KmTmFp7e.Jj8u2YoAc2NUk2NxaYFBmbTvlW4kQPAyilW
\.


--
-- TOC entry 5001 (class 0 OID 16579)
-- Dependencies: 225
-- Data for Name: doctor_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_profile (id, ic, skills, languages, mmc_number, apc_number, specialization, experience_years, bio, address, city, state, postal, phone, gender, birthday, minimum_pay, preferred_days, earliest_start, latest_end, max_distance, email_notif, sms_notif, verified, profile_pic, mmc_file, apc_file, bank_number, work_experience) FROM stdin;
2494e131-f7d1-48ed-983d-a564dcabfe54	030402141167	{"IM Injection"}	{English,Cantonese,Malay}	MMC-54321	APC-12345	Emergency Medicine	5	Experienced doctor	Cheras 	Cheras	Selangor	31400	+60 12-345-6789	male	1997-12-29	40	{Monday,Friday,Tuesday,Wednesday,Thursday}	09:00:00	18:00:00	10	f	f	t	\N	\N	\N	102020200	[{"id": 1751256074704, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "Helped Patients"}]
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	050603141167	{"IM Injection",Suturing,"Wound Care",Venipuncture,ECG}	{English,Malay,Mandarin,Cantonese,Japanese}	MMC-54321	2024/12345	General Practice	10	General practitioner with 8 years of experience in primary care and emergency medicine. Passionate about preventive healthcare and patient education.	39, jalan mutiara seputeh 1, mutiara seputeh 	Kuala Lumpur	Selangor	58000	+60-12-391-2603	male	2005-06-03	40	{Monday,Tuesday,Wednesday,Thursday,Friday}	09:00:00	20:00:00	5	t	t	t	uploads\\download.jpeg	uploads\\mmc-certificate-2.pdf	uploads\\apc-certificate-1.pdf	123456789012	[{"id": 1750149992769, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "General practice and emergency medicine. Handled routine consultations, emergency cases, and minor procedures."}, {"id": 1750150004554, "year": "2018 - 2020", "place": "Klinik Keluarga Ampang", "title": "Doctor", "description": "Family medicine practice focusing on pediatric care and preventive medicine."}, {"id": 1750153612666, "year": "2016 - 2018", "place": "Hostpial Kuala Lumpur ", "title": "Doctor", "description": "General consultation and emergency medicine."}]
\.


--
-- TOC entry 5000 (class 0 OID 16571)
-- Dependencies: 224
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, name, email, password) FROM stdin;
2494e131-f7d1-48ed-983d-a564dcabfe54	Henry Chong	Henry@yahoo.com	$2b$10$pyF1m5POi/L63kY8vzd1SuYoXKSkFUDWeks4YO4G8zTZJC/HJckuS
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	James Chen	james@gmail.com	$2b$10$h7BVMx8pb8BaYE4ZyMoriONYHNfBLUaGp0pjJmqO3XDKVK9kjD2Ii
\.


--
-- TOC entry 5003 (class 0 OID 24592)
-- Dependencies: 227
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, job_id, doctor_id, applied_at, status) FROM stdin;
8	1858268d-567e-4328-948f-c2ec637783f6	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-01 10:41:24.864093	Accepted
\.


--
-- TOC entry 4999 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: manual_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manual_jobs (id, clinic_id, title, description, incentives, day_rate, night_rate, total_pay, date, start_time, end_time, gender, languages, preferred_doctors, paid_break, start_day_time, end_day_time, start_night_time, end_night_time, contact, special_instructions, email, address, phone, status, procedure, rate, two_rates, duration, doctor_id) FROM stdin;
1858268d-567e-4328-948f-c2ec637783f6	0360be22-7d2d-4a97-a684-46c10e58fa92	General Practice Doctor 	Provide general consultation to patients		30.00	30.00	360.00	2025-07-29	09:00:00	19:00:00	female	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Siti Aminah	Arrive 15 mins early to set up and for briefing 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care","IM Injection",Venipuncture,"Wound Care",Suturing,"Basic Surgery"}	40.00	f	9	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5
30c25a61-a87d-43dd-ba3b-6a1ea0ab044e	0360be22-7d2d-4a97-a684-46c10e58fa92	General Practice Doctor 	Provide general consultation to patients		30.00	30.00	360.00	2025-07-31	09:00:00	19:00:00	female	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Siti Aminah	Arrive 15 mins early to set up and for briefing 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted	{"Antenatal Care",ECG,"Paeds Care","IM Injection",Venipuncture,"Wound Care",Suturing,"Basic Surgery"}	40.00	f	9	\N
96db9838-0bb0-446e-aecb-27477539d15e	0360be22-7d2d-4a97-a684-46c10e58fa92	General Practice Doctor 	Provide general consultation to patients		30.00	30.00	360.00	2025-07-30	09:00:00	19:00:00	female	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Siti Aminah	Arrive 15 mins early to set up and for briefing 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted	{"Antenatal Care",ECG,"Paeds Care","IM Injection",Venipuncture,"Wound Care",Suturing,"Basic Surgery"}	40.00	f	9	\N
607fc6f7-7d5d-4901-84a8-a70378847e2c	0360be22-7d2d-4a97-a684-46c10e58fa92	General Practice Doctor 	Provide general consultation to patients		30.00	30.00	360.00	2025-07-28	09:00:00	19:00:00	female	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Siti Aminah	Arrive 15 mins early to set up and for briefing 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted	{"Antenatal Care",ECG,"Paeds Care","IM Injection",Venipuncture,"Wound Care",Suturing,"Basic Surgery"}	40.00	f	9	\N
31a48d0d-a7a5-4dab-8a8a-db191d42e0b7	0360be22-7d2d-4a97-a684-46c10e58fa92	General Practice Doctor 	Provide general consultation to patients		30.00	30.00	360.00	2025-07-27	09:00:00	19:00:00	female	{English,Malay,Mandarin}	f	f	09:00:00	16:00:00	16:00:00	21:00:00	Dr. Siti Aminah	Arrive 15 mins early to set up and for briefing 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	posted	{"Antenatal Care",ECG,"Paeds Care","IM Injection",Venipuncture,"Wound Care",Suturing,"Basic Surgery"}	40.00	f	9	\N
\.


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 226
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 8, true);


--
-- TOC entry 4833 (class 2606 OID 16494)
-- Name: clinic_contact_info clinic_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 16482)
-- Name: clinic_general_info clinic_general_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 16507)
-- Name: clinic_preferences clinic_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16475)
-- Name: clinics clinics_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_email_key UNIQUE (email);


--
-- TOC entry 4829 (class 2606 OID 16473)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4841 (class 2606 OID 16585)
-- Name: doctor_profile doctor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 16578)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 24598)
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 16564)
-- Name: manual_jobs manual_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_jobs
    ADD CONSTRAINT manual_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 16495)
-- Name: clinic_contact_info clinic_contact_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 16483)
-- Name: clinic_general_info clinic_general_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4846 (class 2606 OID 16508)
-- Name: clinic_preferences clinic_preferences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 16586)
-- Name: doctor_profile doctor_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_id_fkey FOREIGN KEY (id) REFERENCES public.doctors(id);


--
-- TOC entry 4848 (class 2606 OID 24604)
-- Name: job_applications job_applications_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4849 (class 2606 OID 32774)
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.manual_jobs(id) ON DELETE CASCADE;


-- Completed on 2025-07-01 12:11:47

--
-- PostgreSQL database dump complete
--

