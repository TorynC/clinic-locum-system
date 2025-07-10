--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-10 15:08:55

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
-- TOC entry 5019 (class 0 OID 16488)
-- Dependencies: 221
-- Data for Name: clinic_contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_contact_info VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur', 'Kuala Lumpur', 59200, '012-901 4256', 'Selangor', 'Dr Fatim');
INSERT INTO public.clinic_contact_info VALUES ('528ed7fe-4e67-4475-b2e4-0d12f8156c49', '42 Jalan Medic, Taman Kesihatan', 'Kuala Lumpur', 58000, '012-5465135', 'Selangor', 'Dr Fatim');
INSERT INTO public.clinic_contact_info VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', 'Ipoh', 21234, '012-5465135', 'Selangor', 'Dr Siti Amanih');


--
-- TOC entry 5018 (class 0 OID 16476)
-- Dependencies: 220
-- Data for Name: clinic_general_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_general_info VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', 'general', 'A 24 hours Ipoh clinic started in April 1983, Klinik Ipoh PFP 24 Jam was the first private GP clinic in the famous medical street that was Jalan Fairpark (Now Jalan Kamarudin Isa)

Situated between the Ipoh GH and the Ipoh Stadium Complex, this Ipoh clinic as well as their doctors have built up a strong following of locals as well as outstation clients who come for their effective treatment methods at fair prices. Even as the GST has increased operating costs significantly, PFP charges have remained unchanged.');
INSERT INTO public.clinic_general_info VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'general', 'Medical Corporate Clinic. General Practice');
INSERT INTO public.clinic_general_info VALUES ('528ed7fe-4e67-4475-b2e4-0d12f8156c49', 'general', 'clinic in KL');
INSERT INTO public.clinic_general_info VALUES ('e5516861-776d-4a3d-af94-ab93b490efb5', 'general', 'general practice clinic');


--
-- TOC entry 5020 (class 0 OID 16500)
-- Dependencies: 222
-- Data for Name: clinic_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic_preferences VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', '{"General Practice","Antenatal Care",ECG,"Paeds Care"}', '{Tamil}', 35, 'male', NULL, NULL);
INSERT INTO public.clinic_preferences VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', '{"Antenatal Care",ECG,"Paeds Care"}', '{Chinese}', 40, 'female', 30.00, false);
INSERT INTO public.clinic_preferences VALUES ('528ed7fe-4e67-4475-b2e4-0d12f8156c49', '{"Antenatal Care",ECG,"Paeds Care","Wound Care"}', '{Chinese}', 30, 'female', 0.00, false);


--
-- TOC entry 5017 (class 0 OID 16466)
-- Dependencies: 219
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinics VALUES ('e5516861-776d-4a3d-af94-ab93b490efb5', 'Klinik Kesihatan Bandar', 'klinikbandar@gmail.com', '$2b$10$1GjS70Xou2AF6Le1tSkTm.910C.86RdBY371cooLHxcr17QRCTepi');
INSERT INTO public.clinics VALUES ('528ed7fe-4e67-4475-b2e4-0d12f8156c49', 'City Clinic', 'cityclinic@gmail.com', '$2b$10$egYWn9/Yy5jLtunxCm/kres5MZWejZVvRt.TkrEZ3KyIN6aaH05W2');
INSERT INTO public.clinics VALUES ('0360be22-7d2d-4a97-a684-46c10e58fa92', 'Poliklinik Fair Park', 'info@pfpipohklinik.com.my', '$2b$10$QCdW8o2fJldS6eUQe2Ix0..smlo.NhGPuKIXN2ZqqdYRD3a11fZHG');
INSERT INTO public.clinics VALUES ('54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'Klinik Oasis Bangsar South', 'klinikoasis@gmail.com', '$2b$10$3PzRnRHF.KmTmFp7e.Jj8u2YoAc2NUk2NxaYFBmbTvlW4kQPAyilW');


--
-- TOC entry 5023 (class 0 OID 16579)
-- Dependencies: 225
-- Data for Name: doctor_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctor_profile VALUES ('cba89044-1c36-4960-b8bd-12d15cba260e', '050603141167', '{"Antenatal Care"}', '{Chinese}', 'MMC-54321', '2024/12345', 15, '', '39, jalan mutiara seputeh 1, mutiara seputeh ', 'Kuala Lumpur', 'Selangor', '31400', '+60123912603', 'male', '2021-02-02', 0, '{Monday}', '09:00:00', '18:00:00', 0, NULL, 'uploads\mmc-certificate-2.pdf', 'uploads\apc-certificate-1.pdf', '012312312312312', '[]', 5.0, 'CIMB');
INSERT INTO public.doctor_profile VALUES ('2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '050603141167', '{"IM Injection",Suturing,"Wound Care",Venipuncture,ECG}', '{Chinese}', 'MMC-54321', '2024/12345', 10, 'General practitioner with 8 years of experience in primary care and emergency medicine. Passionate about preventive healthcare and patient education.', '39, jalan mutiara seputeh 1, mutiara seputeh ', 'Kuala Lumpur', 'Selangor', '58000', '+60123912603', 'male', '2005-06-03', 40, '{Monday,Tuesday,Wednesday,Thursday,Friday}', '09:00:00', '20:00:00', 5, 'uploads\download.jpeg', 'uploads\mmc-certificate-2.pdf', 'uploads\apc-certificate-1.pdf', '123456789012', '[{"id": 1750149992769, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "General practice and emergency medicine. Handled routine consultations, emergency cases, and minor procedures."}, {"id": 1750150004554, "year": "2018 - 2020", "place": "Klinik Keluarga Ampang", "title": "Doctor", "description": "Family medicine practice focusing on pediatric care and preventive medicine."}, {"id": 1750153612666, "year": "2016 - 2018", "place": "Hostpial Kuala Lumpur ", "title": "Doctor", "description": "General consultation and emergency medicine."}]', 4.7, 'Maybank');
INSERT INTO public.doctor_profile VALUES ('2494e131-f7d1-48ed-983d-a564dcabfe54', '030402141f166', '{"IM Injection",Suturing}', '{Chinese}', 'MMC-54323', 'APC-12345', 5, 'Experienced doctor', '42 Jalan Medic, Taman Kesihatanf', 'Cherasf', 'Selangorf', '31400f', '+60123912603', 'male', '1997-12-29', 40, '{Monday,Friday,Tuesday,Wednesday,Thursday}', '09:00:00', '18:00:00', 10, NULL, 'uploads\mmc-certificate-2.pdf', 'uploads\apc-certificate-1.pdf', '102020199', '[{"id": 1751256074704, "year": "2020 - 2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "Helped Patients"}, {"id": 1752044485758, "year": "2023", "place": "Hospital Kuala Lumpur", "title": "Doctor", "description": "helped patients"}, {"id": 1752055347497, "year": "d", "place": "d", "title": "asdf", "description": "d"}]', 4.7, 'CIMB');


--
-- TOC entry 5022 (class 0 OID 16571)
-- Dependencies: 224
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctors VALUES ('2494e131-f7d1-48ed-983d-a564dcabfe54', 'Henry Chong', 'Henry@yahoo.com', '$2b$10$pyF1m5POi/L63kY8vzd1SuYoXKSkFUDWeks4YO4G8zTZJC/HJckuS');
INSERT INTO public.doctors VALUES ('cba89044-1c36-4960-b8bd-12d15cba260e', 'Tan Chun Hen', 'tan@gmail.com', '$2b$10$cr/NcF.O0GO0jp4IddmDCed5XZJuvr/dN55e.mZwpUDEUNOEWhe4m');
INSERT INTO public.doctors VALUES ('2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', 'James Chen', 'james@gmail.com', '$2b$10$h7BVMx8pb8BaYE4ZyMoriONYHNfBLUaGp0pjJmqO3XDKVK9kjD2Ii');


--
-- TOC entry 5027 (class 0 OID 32780)
-- Dependencies: 229
-- Data for Name: favorite_doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.favorite_doctors VALUES (10, '0360be22-7d2d-4a97-a684-46c10e58fa92', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5');


--
-- TOC entry 5025 (class 0 OID 24592)
-- Dependencies: 227
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.job_applications VALUES (17, '9d28dcd0-e278-4b37-8e55-32925170f1e5', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 16:13:20.97035', 'Accepted');
INSERT INTO public.job_applications VALUES (19, '951a6a10-2152-49cd-8221-e40a97c838e0', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-03 16:29:43.205993', 'Cancelled');
INSERT INTO public.job_applications VALUES (18, '951a6a10-2152-49cd-8221-e40a97c838e0', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-03 16:27:42.074114', 'Accepted');
INSERT INTO public.job_applications VALUES (24, '19bac0eb-d5bf-491c-a649-152ead7dee3d', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-08 12:15:45.963453', 'Accepted');
INSERT INTO public.job_applications VALUES (21, 'dbec16aa-02e1-4f3b-9209-5f41dca9c470', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-07 12:36:41.704168', 'Accepted');
INSERT INTO public.job_applications VALUES (25, '991d9ba6-4fde-47d6-9283-719c6950a78b', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-08 16:46:46.006314', 'Accepted');
INSERT INTO public.job_applications VALUES (27, '80faa0ad-31c2-49f8-8bf1-e75427125eee', '2494e131-f7d1-48ed-983d-a564dcabfe54', '2025-07-09 12:44:05.486706', 'Accepted');
INSERT INTO public.job_applications VALUES (28, 'cecd067d-a682-4da6-9ac8-f66eea84bbff', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-10 12:52:35.062897', 'Accepted');
INSERT INTO public.job_applications VALUES (29, '8b0db5c8-f4b0-4b80-9754-742c3ba429c2', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-10 12:52:47.865974', 'Cancelled');
INSERT INTO public.job_applications VALUES (30, 'f723d1dc-cdf0-4110-b086-58a1e09359a8', '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '2025-07-10 13:01:18.157653', 'Pending');


--
-- TOC entry 5021 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: manual_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.manual_jobs VALUES ('991d9ba6-4fde-47d6-9283-719c6950a78b', '0360be22-7d2d-4a97-a684-46c10e58fa92', '', '', 312.00, '2025-07-08', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Siti Amanih', '', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '012-5465135', 'Completed', '{"Antenatal Care",ECG,"Paeds Care"}', 39.00, 9, '2494e131-f7d1-48ed-983d-a564dcabfe54', '12:00:00', '13:00:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('8b0db5c8-f4b0-4b80-9754-742c3ba429c2', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'Tend to patients', 'RM1/Patient', 320.00, '2025-07-15', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Siti Amanih', 'Arrive 15 mins earlier ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '012-5465135', 'posted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, NULL, '12:00:00', '13:00:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('951a6a10-2152-49cd-8221-e40a97c838e0', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'N/A', 'Bank Transfer', 360.00, '2025-07-31', '09:00:00', '18:00:00', 'Male', '{Chinese}', true, 'Dr Siti Amanih', 'Arrive 15 mins earlier to set up ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care","Wound Care",Suturing,"Basic Surgery"}', 40.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '13:06:00', '14:06:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('80faa0ad-31c2-49f8-8bf1-e75427125eee', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'tend to patients', 'Bank transfer', 315.00, '2025-07-28', '09:00:00', '18:00:00', 'Female', '{Chinese}', true, 'Dr Siti Amanih', 'Arrive 15 mins earlier ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '012-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care"}', 35.00, 9, '2494e131-f7d1-48ed-983d-a564dcabfe54', '12:00:00', '13:00:00', 'day', true);
INSERT INTO public.manual_jobs VALUES ('dbec16aa-02e1-4f3b-9209-5f41dca9c470', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'Tend to patients', '', 320.00, '2025-08-01', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Siti Amanih', 'Arrive 15 mins earlier to help set up ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '05-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:30:00', '13:30:00', 'day', true);
INSERT INTO public.manual_jobs VALUES ('f723d1dc-cdf0-4110-b086-58a1e09359a8', '0360be22-7d2d-4a97-a684-46c10e58fa92', 'Tend to patients', 'RM1/patient', 320.00, '2025-07-16', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Siti Amanih', 'arrive 15 mins earlier to setup ', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '012-5465135', 'posted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, NULL, '12:00:00', '13:00:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('9d28dcd0-e278-4b37-8e55-32925170f1e5', '54d9a21a-8f46-4cd8-8937-c2d00ecbfbe5', 'N/A', 'RM1/patient', 280.00, '2025-07-31', '08:00:00', '17:00:00', 'Male', '{Chinese}', false, 'Dr Fatim', 'Arrive 15 mins earlier to set up ', 'klinikoasis@gmail.com', 'Ground Floor (Lot 01), Menara TH, Tower 2A, Avenue 5, The Horizon Bangsar South, 8, Jalan Kerinchi, Wilayah Persekutuan, 59200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur', '012-901 4256', 'Accepted', '{"General Practice","Antenatal Care",ECG,"Paeds Care"}', 35.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:12:00', '13:12:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('19bac0eb-d5bf-491c-a649-152ead7dee3d', '0360be22-7d2d-4a97-a684-46c10e58fa92', '', '', 320.00, '2025-07-23', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Siti Amanih', '', 'info@pfpipohklinik.com.my', '117, Persiaran Fair Park, Taman Fair Park, 31400 Ipoh, Perak', '012-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care"}', 40.00, 9, '2494e131-f7d1-48ed-983d-a564dcabfe54', '12:00:00', '13:00:00', 'day', false);
INSERT INTO public.manual_jobs VALUES ('cecd067d-a682-4da6-9ac8-f66eea84bbff', '528ed7fe-4e67-4475-b2e4-0d12f8156c49', '', 'Rm1/patient', 240.00, '2025-07-15', '09:00:00', '18:00:00', 'Female', '{Chinese}', false, 'Dr Fatim', '', 'cityclinic@gmail.com', '42 Jalan Medic, Taman Kesihatan', '012-5465135', 'Accepted', '{"Antenatal Care",ECG,"Paeds Care","Wound Care"}', 30.00, 9, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', '12:00:00', '13:00:00', 'day', false);


--
-- TOC entry 5029 (class 0 OID 32817)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications VALUES (20, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'cancellation', 'Doctor Cancelled', 'Locum Doctor job at 22/07/2025 at Poliklinik Fair Park', '2025-07-10 10:47:24.965107', true, 'c7553306-0903-4301-8994-30b07918c9aa');
INSERT INTO public.notifications VALUES (22, '528ed7fe-4e67-4475-b2e4-0d12f8156c49', 'clinic', 'application', 'New Application', 'Locum Doctor job at 15/07/2025 at City Clinic', '2025-07-10 12:52:35.070765', false, 'cecd067d-a682-4da6-9ac8-f66eea84bbff');
INSERT INTO public.notifications VALUES (24, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', 'doctor', 'job_application', 'Application Automatically Cancelled', 'Your application for a job on 15/07/2025 has been automatically cancelled due to a time conflict with your accepted job.', '2025-07-10 12:53:06.626402', true, '8b0db5c8-f4b0-4b80-9754-742c3ba429c2');
INSERT INTO public.notifications VALUES (25, '2be557a0-f55b-4f84-bfe8-e7bb3bb52db5', 'doctor', 'job_application', 'Application Accepted', 'Congratulations! Your application for a job on 15/07/2025 has been accepted.', '2025-07-10 12:53:06.627917', true, 'cecd067d-a682-4da6-9ac8-f66eea84bbff');
INSERT INTO public.notifications VALUES (21, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'cancellation', 'Doctor Cancelled', 'Locum Doctor job at 06/08/2025 at Poliklinik Fair Park', '2025-07-10 12:11:26.190269', true, 'dfa78b0c-1d92-4ca3-b134-c2a03642839d');
INSERT INTO public.notifications VALUES (18, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'application', 'New Application', 'Locum Doctor job at 28/07/2025 at Poliklinik Fair Park', '2025-07-09 12:44:05.501879', true, '80faa0ad-31c2-49f8-8bf1-e75427125eee');
INSERT INTO public.notifications VALUES (23, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'application', 'New Application', 'Locum Doctor job at 15/07/2025 at Poliklinik Fair Park', '2025-07-10 12:52:47.869364', true, '8b0db5c8-f4b0-4b80-9754-742c3ba429c2');
INSERT INTO public.notifications VALUES (26, '0360be22-7d2d-4a97-a684-46c10e58fa92', 'clinic', 'application', 'New Application', 'Locum Doctor job at 16/07/2025 at Poliklinik Fair Park', '2025-07-10 13:01:18.1615', false, 'f723d1dc-cdf0-4110-b086-58a1e09359a8');


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


-- Completed on 2025-07-10 15:08:55

--
-- PostgreSQL database dump complete
--

