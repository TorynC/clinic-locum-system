--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-10 15:43:47

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
-- TOC entry 5035 (class 0 OID 0)
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
    state text,
    doctor text
);


ALTER TABLE public.clinic_contact_info OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16476)
-- Name: clinic_general_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_general_info (
    id uuid NOT NULL,
    type text,
    description text
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
    default_rate numeric,
    gender character varying(20),
    night_rate numeric(10,2),
    night_rate_available boolean
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
    profile_pic text,
    mmc_file text,
    apc_file text,
    bank_number text,
    work_experience jsonb,
    reliability_rating numeric(2,1) DEFAULT 5.0,
    bank_name text
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
-- TOC entry 229 (class 1259 OID 32780)
-- Name: favorite_doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorite_doctors (
    id integer NOT NULL,
    clinic_id uuid NOT NULL,
    doctor_id uuid NOT NULL
);


ALTER TABLE public.favorite_doctors OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 32779)
-- Name: favorite_doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorite_doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorite_doctors_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 228
-- Name: favorite_doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorite_doctors_id_seq OWNED BY public.favorite_doctors.id;


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
-- TOC entry 5037 (class 0 OID 0)
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
    description text,
    incentives text,
    total_pay numeric(10,2),
    date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    gender character varying(50),
    languages character varying(50)[],
    paid_break boolean DEFAULT false,
    contact character varying(100),
    special_instructions text,
    email character varying(255),
    address text,
    phone character varying(20),
    status character varying(20),
    procedure text[],
    rate numeric(10,2),
    duration real,
    doctor_id uuid,
    break_start time without time zone,
    break_end time without time zone,
    shift_type text,
    has_break boolean
);


ALTER TABLE public.manual_jobs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 32817)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    user_type character varying(10) NOT NULL,
    type character varying(50),
    title text,
    message text,
    created_at timestamp without time zone DEFAULT now(),
    is_read boolean DEFAULT false,
    job_id uuid
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 32816)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 4835 (class 2604 OID 32783)
-- Name: favorite_doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors ALTER COLUMN id SET DEFAULT nextval('public.favorite_doctors_id_seq'::regclass);


--
-- TOC entry 4833 (class 2604 OID 24595)
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- TOC entry 4836 (class 2604 OID 32820)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 5019 (class 0 OID 16488)
-- Dependencies: 221
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_contact_info (id, address, city, postal, phone, state, doctor) FROM stdin;
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur	Kuala Lumpur	59200	012-901 4256	Selangor	Dr Fatim
528ed7fe-4e67-4475-b2e4-0d12f8156c49	42 Jalan Medic, Taman Kesihatan	Kuala Lumpur	58000	012-5465135	Selangor	Dr Fatim
0360be22-7d2d-4a97-a684-46c10e58fa92	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	Ipoh	21234	012-5465135	Selangor	Dr Siti Amanih
\.


--
-- TOC entry 5018 (class 0 OID 16476)
-- Dependencies: 220
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_general_info (id, type, description) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	general	A 24 hours Ipoh clinic started in April 1983, Klinik Ipoh PFP 24 Jam was the first private GP clinic in the famous medical street that was Jalan Fairpark (Now Jalan Kamarudin Isa)\n\nSituated between the Ipoh GH and the Ipoh Stadium Complex, this Ipoh clinic as well as their doctors have built up a strong following of locals as well as outstation clients who come for their effective treatment methods at fair prices. Even as the GST has increased operating costs significantly, PFP charges have remained unchanged.
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	general	Medical Corporate Clinic. General Practice
528ed7fe-4e67-4475-b2e4-0d12f8156c49	general	clinic in KL
e5516861-776d-4a3d-af94-ab93b490efb5	general	general practice clinic
\.


--
-- TOC entry 5020 (class 0 OID 16500)
-- Dependencies: 222
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_preferences (id, qualifications, languages, default_rate, gender, night_rate, night_rate_available) FROM stdin;
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	{"General Practice","Antenatal Care",ECG,"Paeds Care"}	{Tamil}	35	male	\N	\N
0360be22-7d2d-4a97-a684-46c10e58fa92	{"Antenatal Care",ECG,"Paeds Care"}	{Chinese}	40	female	30.00	f
528ed7fe-4e67-4475-b2e4-0d12f8156c49	{"Antenatal Care",ECG,"Paeds Care","Wound Care"}	{Chinese}	30	female	0.00	f
\.


--
-- TOC entry 5017 (class 0 OID 16466)
-- Dependencies: 219
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, clinic_name, email, password) FROM stdin;
e5516861-776d-4a3d-af94-ab93b490efb5	Klinik Kesihatan Bandar	klinikbandar@gmail.com	$2b$10$1GjS70Xou2AF6Le1tSkTm.910C.86RdBY371cooLHxcr17QRCTepi
528ed7fe-4e67-4475-b2e4-0d12f8156c49	City Clinic	cityclinic@gmail.com	$2b$10$egYWn9/Yy5jLtunxCm/kres5MZWejZVvRt.TkrEZ3KyIN6aaH05W2
0360be22-7d2d-4a97-a684-46c10e58fa92	Poliklinik Fair Park	info@pfpipohklinik.com.my	$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG
54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	Klinik Oasis Bangsar South	klinikoasis@gmail.com	$2b$10$3PzRnRHF.KmTmFp7e.Jj8u2YoAc2NUk2NxaYFBmbTvlW4kQPAyilW
\.


--
-- TOC entry 5023 (class 0 OID 16579)
-- Dependencies: 225
-- Data for Name: doctor_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_profile (id, ic, skills, languages, mmc_number, apc_number, experience_years, bio, address, city, state, postal, phone, gender, birthday, minimum_pay, preferred_days, earliest_start, latest_end, max_distance, profile_pic, mmc_file, apc_file, bank_number, work_experience, reliability_rating, bank_name) FROM stdin;
cba89044-1c36-4960-b8bd-12d15cba260e	050603141167	{"Antenatal Care"}	{Chinese}	MMC-54321	2024/12345	15		39, jalan mutiara seputeh 1, mutiara seputeh 	Kuala Lumpur	Selangor	31400	+60123912603	male	2021-02-02	0	{Monday}	09:00:00	18:00:00	0	\N	uploads\\mmc-certificate-2.pdf	uploads\\apc-certificate-1.pdf	012312312312312	[]	5.0	CIMB
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	050603141167	{"IM Injection",Suturing,"Wound Care",Venipuncture,ECG}	{Chinese}	MMC-54321	2024/12345	10	General practitioner with 8 years of experience in primary care and emergency medicine. Passionate about preventive healthcare and patient education.	39, jalan mutiara seputeh 1, mutiara seputeh 	Kuala Lumpur	Selangor	58000	+60123912603	male	2005-06-03	40	{Monday,Tuesday,Wednesday,Thursday,Friday}	09:00:00	20:00:00	5	uploads\\download.jpeg	uploads\\mmc-certificate-2.pdf	uploads\\apc-certificate-1.pdf	123456789012	[{"id": 1750149992769, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "General practice and emergency medicine. Handled routine consultations, emergency cases, and minor procedures."}, {"id": 1750150004554, "year": "2018 - 2020", "place": "Klinik Keluarga Ampang", "title": "Doctor", "description": "Family medicine practice focusing on pediatric care and preventive medicine."}, {"id": 1750153612666, "year": "2016 - 2018", "place": "Hostpial Kuala Lumpur ", "title": "Doctor", "description": "General consultation and emergency medicine."}]	4.7	Maybank
2494e131-f7d1-48ed-983d-a564dcabfe54	030402141f166	{"IM Injection",Suturing}	{Chinese}	MMC-54323	APC-12345	5	Experienced doctor	42 Jalan Medic, Taman Kesihatanf	Cherasf	Selangorf	31400f	+60123912603	male	1997-12-29	40	{Monday,Friday,Tuesday,Wednesday,Thursday}	09:00:00	18:00:00	10	\N	uploads\\mmc-certificate-2.pdf	uploads\\apc-certificate-1.pdf	102020199	[{"id": 1751256074704, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "Helped Patients"}, {"id": 1752044485758, "year": "2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "helped patients"}, {"id": 1752055347497, "year": "d", "place": "d", "title": "asdf", "description": "d"}]	4.7	CIMB
\.


--
-- TOC entry 5022 (class 0 OID 16571)
-- Dependencies: 224
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, name, email, password) FROM stdin;
2494e131-f7d1-48ed-983d-a564dcabfe54	Henry Chong	Henry@yahoo.com	$2b$10$pyF1m5POi/L63kY8vzd1SuYoXKSkFUDWeks4YO4G8zTZJC/HJckuS
cba89044-1c36-4960-b8bd-12d15cba260e	Tan Chun Hen	tan@gmail.com	$2b$10$cr/NcF.O0GO0jp4IddmDCed5XZJuvr/dN55e.mZwpUDEUNOEWhe4m
2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	James Chen	james@gmail.com	$2b$10$h7BVMx8pb8BaYE4ZyMoriONYHNfBLUaGp0pjJmqO3XDKVK9kjD2Ii
\.


--
-- TOC entry 5027 (class 0 OID 32780)
-- Dependencies: 229
-- Data for Name: favorite_doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorite_doctors (id, clinic_id, doctor_id) FROM stdin;
10	0360be22-7d2d-4a97-a684-46c10e58fa92	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5
\.


--
-- TOC entry 5025 (class 0 OID 24592)
-- Dependencies: 227
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, job_id, doctor_id, applied_at, status) FROM stdin;
17	9d28dcd0-e278-4b37-8e55-32925170f1e5	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-03 16:13:20.97035	Accepted
19	951a6a10-2152-49cd-8221-e40a97c838e0	2494e131-f7d1-48ed-983d-a564dcabfe54	2025-07-03 16:29:43.205993	Cancelled
18	951a6a10-2152-49cd-8221-e40a97c838e0	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-03 16:27:42.074114	Accepted
24	19bac0eb-d5bf-491c-a649-152ead7dee3d	2494e131-f7d1-48ed-983d-a564dcabfe54	2025-07-08 12:15:45.963453	Accepted
21	dbec16aa-02e1-4f3b-9209-5f41dca9c470	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-07 12:36:41.704168	Accepted
25	991d9ba6-4fde-47d6-9283-719c6950a78b	2494e131-f7d1-48ed-983d-a564dcabfe54	2025-07-08 16:46:46.006314	Accepted
27	80faa0ad-31c2-49f8-8bf1-e75427125eee	2494e131-f7d1-48ed-983d-a564dcabfe54	2025-07-09 12:44:05.486706	Accepted
28	cecd067d-a682-4da6-9ac8-f66eea84bbff	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-10 12:52:35.062897	Accepted
29	8b0db5c8-f4b0-4b80-9754-742c3ba429c2	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-10 12:52:47.865974	Cancelled
30	f723d1dc-cdf0-4110-b086-58a1e09359a8	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	2025-07-10 13:01:18.157653	Pending
\.


--
-- TOC entry 5021 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: manual_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manual_jobs (id, clinic_id, description, incentives, total_pay, date, start_time, end_time, gender, languages, paid_break, contact, special_instructions, email, address, phone, status, procedure, rate, duration, doctor_id, break_start, break_end, shift_type, has_break) FROM stdin;
991d9ba6-4fde-47d6-9283-719c6950a78b	0360be22-7d2d-4a97-a684-46c10e58fa92			312.00	2025-07-08	09:00:00	18:00:00	Female	{Chinese}	f	Dr Siti Amanih		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	012-5465135	Completed	{"Antenatal Care",ECG,"Paeds Care"}	39.00	9	2494e131-f7d1-48ed-983d-a564dcabfe54	12:00:00	13:00:00	day	f
8b0db5c8-f4b0-4b80-9754-742c3ba429c2	0360be22-7d2d-4a97-a684-46c10e58fa92	Tend to patients	RM1/Patient	320.00	2025-07-15	09:00:00	18:00:00	Female	{Chinese}	f	Dr Siti Amanih	Arrive 15 mins earlier 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	012-5465135	posted	{"Antenatal Care",ECG,"Paeds Care"}	40.00	9	\N	12:00:00	13:00:00	day	f
951a6a10-2152-49cd-8221-e40a97c838e0	0360be22-7d2d-4a97-a684-46c10e58fa92	N/A	Bank Transfer	360.00	2025-07-31	09:00:00	18:00:00	Male	{Chinese}	t	Dr Siti Amanih	Arrive 15 mins earlier to set up 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care","Wound Care",Suturing,"Basic Surgery"}	40.00	9	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	13:06:00	14:06:00	day	f
80faa0ad-31c2-49f8-8bf1-e75427125eee	0360be22-7d2d-4a97-a684-46c10e58fa92	tend to patients	Bank transfer	315.00	2025-07-28	09:00:00	18:00:00	Female	{Chinese}	t	Dr Siti Amanih	Arrive 15 mins earlier 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	012-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care"}	35.00	9	2494e131-f7d1-48ed-983d-a564dcabfe54	12:00:00	13:00:00	day	t
dbec16aa-02e1-4f3b-9209-5f41dca9c470	0360be22-7d2d-4a97-a684-46c10e58fa92	Tend to patients		320.00	2025-08-01	09:00:00	18:00:00	Female	{Chinese}	f	Dr Siti Amanih	Arrive 15 mins earlier to help set up 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	05-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care"}	40.00	9	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	12:30:00	13:30:00	day	t
f723d1dc-cdf0-4110-b086-58a1e09359a8	0360be22-7d2d-4a97-a684-46c10e58fa92	Tend to patients	RM1/patient	320.00	2025-07-16	09:00:00	18:00:00	Female	{Chinese}	f	Dr Siti Amanih	arrive 15 mins earlier to setup 	info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	012-5465135	posted	{"Antenatal Care",ECG,"Paeds Care"}	40.00	9	\N	12:00:00	13:00:00	day	f
9d28dcd0-e278-4b37-8e55-32925170f1e5	54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5	N/A	RM1/patient	280.00	2025-07-31	08:00:00	17:00:00	Male	{Chinese}	f	Dr Fatim	Arrive 15 mins earlier to set up 	klinikoasis@gmail.com	Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur	012-901 4256	Accepted	{"General Practice","Antenatal Care",ECG,"Paeds Care"}	35.00	9	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	12:12:00	13:12:00	day	f
19bac0eb-d5bf-491c-a649-152ead7dee3d	0360be22-7d2d-4a97-a684-46c10e58fa92			320.00	2025-07-23	09:00:00	18:00:00	Female	{Chinese}	f	Dr Siti Amanih		info@pfpipohklinik.com.my	117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak	012-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care"}	40.00	9	2494e131-f7d1-48ed-983d-a564dcabfe54	12:00:00	13:00:00	day	f
cecd067d-a682-4da6-9ac8-f66eea84bbff	528ed7fe-4e67-4475-b2e4-0d12f8156c49		Rm1/patient	240.00	2025-07-15	09:00:00	18:00:00	Female	{Chinese}	f	Dr Fatim		cityclinic@gmail.com	42 Jalan Medic, Taman Kesihatan	012-5465135	Accepted	{"Antenatal Care",ECG,"Paeds Care","Wound Care"}	30.00	9	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	12:00:00	13:00:00	day	f
\.


--
-- TOC entry 5029 (class 0 OID 32817)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, user_type, type, title, message, created_at, is_read, job_id) FROM stdin;
20	0360be22-7d2d-4a97-a684-46c10e58fa92	clinic	cancellation	Doctor Cancelled	Locum Doctor job at 22/07/2025 at Poliklinik Fair Park	2025-07-10 10:47:24.965107	t	c7553306-0903-4301-8994-30b07918c9aa
22	528ed7fe-4e67-4475-b2e4-0d12f8156c49	clinic	application	New Application	Locum Doctor job at 15/07/2025 at City Clinic	2025-07-10 12:52:35.070765	f	cecd067d-a682-4da6-9ac8-f66eea84bbff
24	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	doctor	job_application	Application Automatically Cancelled	Your application for a job on 15/07/2025 has been automatically cancelled due to a time conflict with your accepted job.	2025-07-10 12:53:06.626402	t	8b0db5c8-f4b0-4b80-9754-742c3ba429c2
25	2be557a0-f55b-4f84-bfe8-e7bb3bb52db5	doctor	job_application	Application Accepted	Congratulations! Your application for a job on 15/07/2025 has been accepted.	2025-07-10 12:53:06.627917	t	cecd067d-a682-4da6-9ac8-f66eea84bbff
21	0360be22-7d2d-4a97-a684-46c10e58fa92	clinic	cancellation	Doctor Cancelled	Locum Doctor job at 06/08/2025 at Poliklinik Fair Park	2025-07-10 12:11:26.190269	t	dfa78b0c-1d92-4ca3-b134-c2a03642839d
18	0360be22-7d2d-4a97-a684-46c10e58fa92	clinic	application	New Application	Locum Doctor job at 28/07/2025 at Poliklinik Fair Park	2025-07-09 12:44:05.501879	t	80faa0ad-31c2-49f8-8bf1-e75427125eee
23	0360be22-7d2d-4a97-a684-46c10e58fa92	clinic	application	New Application	Locum Doctor job at 15/07/2025 at Poliklinik Fair Park	2025-07-10 12:52:47.869364	t	8b0db5c8-f4b0-4b80-9754-742c3ba429c2
26	0360be22-7d2d-4a97-a684-46c10e58fa92	clinic	application	New Application	Locum Doctor job at 16/07/2025 at Poliklinik Fair Park	2025-07-10 13:01:18.1615	f	f723d1dc-cdf0-4110-b086-58a1e09359a8
\.


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 228
-- Name: favorite_doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorite_doctors_id_seq', 11, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 226
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 30, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 26, true);


--
-- TOC entry 4846 (class 2606 OID 16494)
-- Name: clinic_contact_info clinic_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16482)
-- Name: clinic_general_info clinic_general_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 16507)
-- Name: clinic_preferences clinic_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16475)
-- Name: clinics clinics_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_email_key UNIQUE (email);


--
-- TOC entry 4842 (class 2606 OID 16473)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2606 OID 16585)
-- Name: doctor_profile doctor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16578)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 32787)
-- Name: favorite_doctors favorite_doctors_clinic_id_doctor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_clinic_id_doctor_id_key UNIQUE (clinic_id, doctor_id);


--
-- TOC entry 4860 (class 2606 OID 32785)
-- Name: favorite_doctors favorite_doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 24598)
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 16564)
-- Name: manual_jobs manual_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_jobs
    ADD CONSTRAINT manual_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 32825)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 1259 OID 32826)
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_type, user_id);


--
-- TOC entry 4865 (class 2606 OID 16495)
-- Name: clinic_contact_info clinic_contact_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4864 (class 2606 OID 16483)
-- Name: clinic_general_info clinic_general_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 16508)
-- Name: clinic_preferences clinic_preferences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 16586)
-- Name: doctor_profile doctor_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_id_fkey FOREIGN KEY (id) REFERENCES public.doctors(id);


--
-- TOC entry 4870 (class 2606 OID 32788)
-- Name: favorite_doctors favorite_doctors_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4871 (class 2606 OID 32793)
-- Name: favorite_doctors favorite_doctors_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4868 (class 2606 OID 24604)
-- Name: job_applications job_applications_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4869 (class 2606 OID 32774)
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.manual_jobs(id) ON DELETE CASCADE;


-- Completed on 2025-07-10 15:43:47

--
-- PostgreSQL database dump complete
--

