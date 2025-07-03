--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-03 20:31:43

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
-- TOC entry 5037 (class 1262 OID 16388)
-- Name: LocumLah_DB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "LocumLah_DB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Malaysia.1252';


ALTER DATABASE "LocumLah_DB" OWNER TO postgres;

\connect "LocumLah_DB"

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
-- TOC entry 5038 (class 0 OID 0)
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
    website text,
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
    preferred_doctors_only boolean DEFAULT false,
    default_rate numeric,
    start_time time without time zone,
    end_time time without time zone,
    gender character varying(20)
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
    work_experience jsonb,
    reliability_rating numeric(2,1) DEFAULT 5.0
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
-- TOC entry 5039 (class 0 OID 0)
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
-- TOC entry 5040 (class 0 OID 0)
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
    preferred_doctors boolean DEFAULT false,
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
    shift_type text
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
    is_read boolean DEFAULT false
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
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 4837 (class 2604 OID 32783)
-- Name: favorite_doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors ALTER COLUMN id SET DEFAULT nextval('public.favorite_doctors_id_seq'::regclass);


--
-- TOC entry 4835 (class 2604 OID 24595)
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- TOC entry 4838 (class 2604 OID 32820)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 5021 (class 0 OID 16488)
-- Dependencies: 221
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_contact_info VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', 'Ipoh', 31400, '05-5465135', 'pfpipohklinik.com.my', 'Selangor', 'Dr Siti Amanih');
INSERT INTO public.clinic_contact_info VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur', 'Kuala Lumpur', 59200, '012-901 4256', 'N/A', 'Selangor', 'Dr Fatim');


--
-- TOC entry 5020 (class 0 OID 16476)
-- Dependencies: 220
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_general_info VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', 'specialist', 'A 24 hours Ipoh clinic started in April 1984, Klinik Ipoh PFP 24 Jam was the first private GP clinic in the famous medical street that was Jalan Fairpark (Now Jalan Kamarudin Isa)

Situated between the Ipoh GH and the Ipoh Stadium Complex, this Ipoh clinic as well as their doctors have built up a strong following of locals as well as outstation clients who come for their effective treatment methods at fair prices. Even as the GST has increased operating costs significantly, PFP charges have remained unchanged.');
INSERT INTO public.clinic_general_info VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', '', 'Medical Corporate Clinic. General Practice');


--
-- TOC entry 5022 (class 0 OID 16500)
-- Dependencies: 222
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_preferences VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', '{"Antenatal Care",ECG,"Paeds Care"}', '{English,Malay,Mandarin}', true, 40, '09:00:00', '18:00:00', 'female');
INSERT INTO public.clinic_preferences VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', '{"General Practice","Antenatal Care",ECG,"Paeds Care"}', '{English,Mandarin,Malay,Tamil}', true, 35, '08:00:00', '17:00:00', 'male');


--
-- TOC entry 5019 (class 0 OID 16466)
-- Dependencies: 219
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinics VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', 'Poliklinik Fair Park', 'info@pfpipohklinik.com.my', '$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG');
INSERT INTO public.clinics VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'Klinik Oasis Bangsar South', 'klinikoasis@gmail.com', '$2b$10$3PzRnRHF.KmTmFp7e.Jj8u2YoAc2NUk2NxaYFBmbTvlW4kQPAyilW');


--
-- TOC entry 5025 (class 0 OID 16579)
-- Dependencies: 225
-- Data for Name: doctor_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctor_profile VALUES ('2494e131-f7d1-48ed-983d-a564dcabfe54', '030402141167', '{"IM Injection"}', '{English,Cantonese,Malay}', 'MMC-54321', 'APC-12345', 'Emergency Medicine', 5, 'Experienced doctor', 'Cheras ', 'Cheras', 'Selangor', '31400', '+60 12-345-6789', 'male', '1997-12-29', 40, '{Monday,Friday,Tuesday,Wednesday,Thursday}', '09:00:00', '18:00:00', 10, false, false, true, NULL, NULL, NULL, '102020200', '[{"id": 1751256074704, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "Helped Patients"}]', 4.8);
INSERT INTO public.doctor_profile VALUES ('2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '050603141167', '{"IM Injection",Suturing,"Wound Care",Venipuncture,ECG}', '{English,Malay,Mandarin,Cantonese,Japanese}', 'MMC-54321', '2024/12345', 'General Practice', 10, 'General practitioner with 8 years of experience in primary care and emergency medicine. Passionate about preventive healthcare and patient education.', '39, jalan mutiara seputeh 1, mutiara seputeh ', 'Kuala Lumpur', 'Selangor', '58000', '+60-12-391-2603', 'male', '2005-06-03', 40, '{Monday,Tuesday,Wednesday,Thursday,Friday}', '09:00:00', '20:00:00', 5, true, true, true, 'uploads\download.jpeg', 'uploads\mmc-certificate-2.pdf', 'uploads\apc-certificate-1.pdf', '123456789012', '[{"id": 1750149992769, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "General practice and emergency medicine. Handled routine consultations, emergency cases, and minor procedures."}, {"id": 1750150004554, "year": "2018 - 2020", "place": "Klinik Keluarga Ampang", "title": "Doctor", "description": "Family medicine practice focusing on pediatric care and preventive medicine."}, {"id": 1750153612666, "year": "2016 - 2018", "place": "Hostpial Kuala Lumpur ", "title": "Doctor", "description": "General consultation and emergency medicine."}]', 4.9);


--
-- TOC entry 5024 (class 0 OID 16571)
-- Dependencies: 224
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctors VALUES ('2494e131-f7d1-48ed-983d-a564dcabfe54', 'Henry Chong', 'Henry@yahoo.com', '$2b$10$pyF1m5POi/L63kY8vzd1SuYoXKSkFUDWeks4YO4G8zTZJC/HJckuS');
INSERT INTO public.doctors VALUES ('2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', 'James Chen', 'james@gmail.com', '$2b$10$h7BVMx8pb8BaYE4ZyMoriONYHNfBLUaGp0pjJmqO3XDKVK9kjD2Ii');


--
-- TOC entry 5029 (class 0 OID 32780)
-- Dependencies: 229
-- Data for Name: favorite_doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.favorite_doctors VALUES (10, '0360be22-7d2d-4a97-a684-46c10e58fa92', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5');


--
-- TOC entry 5027 (class 0 OID 24592)
-- Dependencies: 227
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.job_applications VALUES (10, '3689d7bb-6bfb-4a92-8ed3-d5835b341dac', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-02 17:10:39.1132', 'Cancelled');
INSERT INTO public.job_applications VALUES (12, '3689d7bb-6bfb-4a92-8ed3-d5835b341dac', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 14:17:10.666547', 'Cancelled');
INSERT INTO public.job_applications VALUES (13, '85af4f5d-3efd-47f7-8042-398ff6885935', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 14:17:19.650734', 'Cancelled');
INSERT INTO public.job_applications VALUES (14, 'c7553306-0903-4301-8994-30b07918c9aa', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 14:23:44.709787', 'Cancelled');
INSERT INTO public.job_applications VALUES (15, 'c7553306-0903-4301-8994-30b07918c9aa', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 14:33:53.316106', 'Accepted');
INSERT INTO public.job_applications VALUES (17, '9d28dcd0-e278-4b37-8e55-32925170f1e5', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 16:13:20.97035', 'Accepted');
INSERT INTO public.job_applications VALUES (18, '951a6a10-2152-49cd-8221-e40a97c838e0', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 16:27:42.074114', 'Pending');
INSERT INTO public.job_applications VALUES (19, '951a6a10-2152-49cd-8221-e40a97c838e0', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 16:29:43.205993', 'Cancelled');
INSERT INTO public.job_applications VALUES (20, '29dc1331-aadf-43b2-9565-274343d3131c', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 17:59:49.350075', 'Accepted');
INSERT INTO public.job_applications VALUES (9, '0181046f-e9f1-4528-a01a-ac69be0026e3', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-02 12:51:57.430696', 'Accepted');
INSERT INTO public.job_applications VALUES (11, '85af4f5d-3efd-47f7-8042-398ff6885935', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 13:03:03.797042', 'Cancelled');


--
-- TOC entry 5023 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: manual_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.manual_jobs VALUES ('0181046f-e9f1-4528-a01a-ac69be0026e3', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'N/A', 'RM1/Patient', 351.00, '2025-07-01', '09:00:00', '18:00:00', 'female', '{English,Malay,Mandarin}', true, true, 'Dr Siti Amanih', 'Arrive 15 mins early to set up and briefing', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Completed', '{"Antenatal Care",ECG,"Paeds Care","Wound Care",Suturing}', 39.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:00:00', '13:00:00', 'day');
INSERT INTO public.manual_jobs VALUES ('3689d7bb-6bfb-4a92-8ed3-d5835b341dac', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'Provide consultation to patients', 'Bank Transfer', 316.67, '2025-07-03', '09:00:00', '18:00:00', 'female', '{English,Malay,Mandarin,"Bahasa Malaysia"}', true, false, 'Dr Siti Amanih', 'Arrive 15 mins earlier to set up and prepare', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Completed', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, NULL, '12:00:00', '13:05:00', 'day');
INSERT INTO public.manual_jobs VALUES ('c7553306-0903-4301-8994-30b07918c9aa', '0360be22-7d2d-4a97-a684-46c10e58fa92', '', '', 310.67, '2025-07-22', '09:00:00', '17:30:00', 'female', '{English,Malay,Mandarin}', true, false, 'Dr Siti Amanih', '', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 8.5, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:41:00', '13:25:00', 'day');
INSERT INTO public.manual_jobs VALUES ('85af4f5d-3efd-47f7-8042-398ff6885935', '0360be22-7d2d-4a97-a684-46c10e58fa92', '', 'Rm1/patient', 280.00, '2025-07-17', '09:00:00', '16:00:00', 'female', '{English,Malay,Mandarin}', true, true, 'Dr Siti Amanih', '', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Urgent', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 7, NULL, '16:01:00', '17:37:00', 'day');
INSERT INTO public.manual_jobs VALUES ('9d28dcd0-e278-4b37-8e55-32925170f1e5', '54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'N/A', 'RM1/patient', 280.00, '2025-07-31', '08:00:00', '17:00:00', 'male', '{English,Mandarin,Malay,Tamil}', true, false, 'Dr Fatim', 'Arrive 15 mins earlier to set up ', 'klinikoasis@gmail.com', 'Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur', '012-901 4256', 'Accepted', '{"General Practice","Antenatal Care",ECG,"Paeds Care"}', 35.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:12:00', '13:12:00', 'day');
INSERT INTO public.manual_jobs VALUES ('951a6a10-2152-49cd-8221-e40a97c838e0', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'N/A', 'Bank Transfer', 360.00, '2025-07-31', '09:00:00', '18:00:00', 'male', '{English,Malay,Mandarin}', false, true, 'Dr Siti Amanih', 'Arrive 15 mins earlier to set up ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Urgent', '{"Antenatal Care",ECG,"Paeds Care","Wound Care",Suturing,"Basic Surgery"}', 40.00, 9, NULL, '13:06:00', '14:06:00', 'day');
INSERT INTO public.manual_jobs VALUES ('29dc1331-aadf-43b2-9565-274343d3131c', '0360be22-7d2d-4a97-a684-46c10e58fa92', '', '', 360.00, '2025-07-24', '09:00:00', '18:00:00', 'female', '{English,Malay,Mandarin}', true, true, 'Dr Siti Amanih', '', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, '2494e131-f7d1-48ed-983d-a564dcabfe54', '13:59:00', '14:59:00', '');


--
-- TOC entry 5031 (class 0 OID 32817)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications VALUES (2, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'cancellation', 'Doctor Cancelled', 'A doctor cancelled their shift for Job ID: 951a6a10-2152-49cd-8221-e40a97c838e0.', '2025-07-03 17:39:50.846792', false);
INSERT INTO public.notifications VALUES (3, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'application', 'New Application', 'A doctor applied for your job (Job ID: 29dc1331-aadf-43b2-9565-274343d3131c).', '2025-07-03 17:59:49.35465', false);
INSERT INTO public.notifications VALUES (4, '2494e131-f7d1-48ed-983d-a564dcabfe54', 'doctor', 'accepted', 'Application Accepted', 'Your application for Job ID: 29dc1331-aadf-43b2-9565-274343d3131c was accepted!', '2025-07-03 17:59:58.155245', true);
INSERT INTO public.notifications VALUES (1, '2494e131-f7d1-48ed-983d-a564dcabfe54', 'doctor', 'accepted', 'Application Accepted', 'Your application for Job ID: 951a6a10-2152-49cd-8221-e40a97c838e0 was accepted!', '2025-07-03 17:15:38.548865', true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 228
-- Name: favorite_doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorite_doctors_id_seq', 10, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 226
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 20, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 4, true);


--
-- TOC entry 4848 (class 2606 OID 16494)
-- Name: clinic_contact_info clinic_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 16482)
-- Name: clinic_general_info clinic_general_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 16507)
-- Name: clinic_preferences clinic_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16475)
-- Name: clinics clinics_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_email_key UNIQUE (email);


--
-- TOC entry 4844 (class 2606 OID 16473)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 16585)
-- Name: doctor_profile doctor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2606 OID 16578)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 32787)
-- Name: favorite_doctors favorite_doctors_clinic_id_doctor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_clinic_id_doctor_id_key UNIQUE (clinic_id, doctor_id);


--
-- TOC entry 4862 (class 2606 OID 32785)
-- Name: favorite_doctors favorite_doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 24598)
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16564)
-- Name: manual_jobs manual_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_jobs
    ADD CONSTRAINT manual_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 32825)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 1259 OID 32826)
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_type, user_id);


--
-- TOC entry 4867 (class 2606 OID 16495)
-- Name: clinic_contact_info clinic_contact_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 16483)
-- Name: clinic_general_info clinic_general_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 16508)
-- Name: clinic_preferences clinic_preferences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 16586)
-- Name: doctor_profile doctor_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_profile
    ADD CONSTRAINT doctor_profile_id_fkey FOREIGN KEY (id) REFERENCES public.doctors(id);


--
-- TOC entry 4872 (class 2606 OID 32788)
-- Name: favorite_doctors favorite_doctors_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4873 (class 2606 OID 32793)
-- Name: favorite_doctors favorite_doctors_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_doctors
    ADD CONSTRAINT favorite_doctors_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4870 (class 2606 OID 24604)
-- Name: job_applications job_applications_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- TOC entry 4871 (class 2606 OID 32774)
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.manual_jobs(id) ON DELETE CASCADE;


-- Completed on 2025-07-03 20:31:43

--
-- PostgreSQL database dump complete
--

