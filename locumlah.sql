--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-10 10:59:48

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
-- TOC entry 2 (class 3079 OID 16418)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16488)
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
-- TOC entry 221 (class 1259 OID 16476)
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
-- TOC entry 223 (class 1259 OID 16500)
-- Name: clinic_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_preferences (
    id uuid NOT NULL,
    rate integer,
    qualifications text[],
    languages text[],
    preferred_doctors_only boolean DEFAULT false
);


ALTER TABLE public.clinic_preferences OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16466)
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
-- TOC entry 219 (class 1259 OID 16408)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16407)
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 218
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- TOC entry 4795 (class 2604 OID 16411)
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- TOC entry 4964 (class 0 OID 16488)
-- Dependencies: 222
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_contact_info (id, address, city, postal, phone, website) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	Kulai 2	Johor	61000	0123912612	www.cityclinichostpial2.com
0360be22-7d2d-4a97-a684-46c10e58fa92	ipoh 	ipoh	80000	0122223338	www.ipohclinic.com
\.


--
-- TOC entry 4963 (class 0 OID 16476)
-- Dependencies: 221
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_general_info (id, type, description, year) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	hospital	City Medical Clinic provides comprehensive healthcare services to the community with a focus on family medicine and preventive care. \nwe are determined to provide the best healthcare possible at an affordable rate for everyone	1973
0360be22-7d2d-4a97-a684-46c10e58fa92	dental	Ipoh clinic	1929
\.


--
-- TOC entry 4965 (class 0 OID 16500)
-- Dependencies: 223
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_preferences (id, rate, qualifications, languages, preferred_doctors_only) FROM stdin;
3774dfed-adae-4f6d-97c5-30bdc05237f5	222	{"General Practice",Dental,Surgery}	{Mandarin,English,Malay,Tamil}	t
0360be22-7d2d-4a97-a684-46c10e58fa92	70	{"General Practice",Emergency}	{English,Mandarin,Malay}	t
\.


--
-- TOC entry 4962 (class 0 OID 16466)
-- Dependencies: 220
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, clinic_name, email, password) FROM stdin;
0360be22-7d2d-4a97-a684-46c10e58fa92	ipoh clinic	ipohclinic@gmail.com	$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG
3774dfed-adae-4f6d-97c5-30bdc05237f5	clinic	clinic2@gmail.com	$2b$10$BLsLfU7l1RRKLRtLC3rAneTrgujieMY0hPflNja3JfNJTVMZO4NU6
\.


--
-- TOC entry 4961 (class 0 OID 16408)
-- Dependencies: 219
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, name, email, password) FROM stdin;
1	Dr Michael	DMC@gmail.com	$2b$10$3W0DEhybJYdBr6F74T71Huau.itfPP7Hji.A7av45xq6ZOzix.mIe
2	Dr Chong	Chong@gmail.com	$2b$10$i0i/a14yFi91CNWSGsqaaO2Lctnb7G9.zW2NHvp/qvmacDJRpHq3u
3	Dr chua	chua@gmail.com	$2b$10$FaYUA1.Ejl/nb78t6NVTQu7hJ.lh497iodZ5aKYrjNfO8v3lQXi0m
4	James	james@gmail.com	$2b$10$eJ4oySwpPIya6GQXYOE1TeobY0ahiJDVN94Tc.Ysw48xrO31RWNSq
5	yap	yap@gmail.com	$2b$10$Z8Gzkxu/H9EAZpkOhZh34OCFKD/byUSkZO9gLuCYVGX6psPVyyCB6
\.


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 218
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 5, true);


--
-- TOC entry 4809 (class 2606 OID 16494)
-- Name: clinic_contact_info clinic_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 16482)
-- Name: clinic_general_info clinic_general_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16507)
-- Name: clinic_preferences clinic_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16475)
-- Name: clinics clinics_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_email_key UNIQUE (email);


--
-- TOC entry 4805 (class 2606 OID 16473)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 16417)
-- Name: doctors doctors_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_email_key UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 16415)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16495)
-- Name: clinic_contact_info clinic_contact_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_contact_info
    ADD CONSTRAINT clinic_contact_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4812 (class 2606 OID 16483)
-- Name: clinic_general_info clinic_general_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_general_info
    ADD CONSTRAINT clinic_general_info_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4814 (class 2606 OID 16508)
-- Name: clinic_preferences clinic_preferences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_preferences
    ADD CONSTRAINT clinic_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.clinics(id) ON DELETE CASCADE;


-- Completed on 2025-06-10 10:59:49

--
-- PostgreSQL database dump complete
--

