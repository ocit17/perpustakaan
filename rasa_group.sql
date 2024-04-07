--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.24
-- Dumped by pg_dump version 9.6.0

-- Started on 2024-04-07 16:05:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2183 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 194 (class 1259 OID 29843)
-- Name: history_peminjaman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE history_peminjaman (
    id integer NOT NULL,
    id_transaksi integer NOT NULL,
    id_buku integer NOT NULL,
    jumlah integer,
    tanggal_peminjaman date,
    tanggal_pengembalian date
);


ALTER TABLE history_peminjaman OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 29841)
-- Name: history_peminjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE history_peminjaman_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE history_peminjaman_id_seq OWNER TO postgres;

--
-- TOC entry 2184 (class 0 OID 0)
-- Dependencies: 193
-- Name: history_peminjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE history_peminjaman_id_seq OWNED BY history_peminjaman.id;


--
-- TOC entry 188 (class 1259 OID 29801)
-- Name: master_buku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE master_buku (
    id integer NOT NULL,
    judul character varying(255),
    penulis character varying(100),
    penerbit character varying(100),
    tahun_terbit integer
);


ALTER TABLE master_buku OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 29799)
-- Name: master_buku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE master_buku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE master_buku_id_seq OWNER TO postgres;

--
-- TOC entry 2185 (class 0 OID 0)
-- Dependencies: 187
-- Name: master_buku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE master_buku_id_seq OWNED BY master_buku.id;


--
-- TOC entry 190 (class 1259 OID 29809)
-- Name: master_mahasiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE master_mahasiswa (
    id integer NOT NULL,
    nama character varying(255),
    nim character varying(20),
    jurusan character varying(100),
    tanggal_lahir date
);


ALTER TABLE master_mahasiswa OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 29807)
-- Name: master_mahasiswa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE master_mahasiswa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE master_mahasiswa_id_seq OWNER TO postgres;

--
-- TOC entry 2186 (class 0 OID 0)
-- Dependencies: 189
-- Name: master_mahasiswa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE master_mahasiswa_id_seq OWNED BY master_mahasiswa.id;


--
-- TOC entry 192 (class 1259 OID 29830)
-- Name: rak_inventory_stok_buku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE rak_inventory_stok_buku (
    id integer NOT NULL,
    id_buku integer,
    nama_rak character varying(100),
    jumlah integer,
    kondisi character varying(100)
);


ALTER TABLE rak_inventory_stok_buku OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 29828)
-- Name: rak_inventory_stok_buku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE rak_inventory_stok_buku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE rak_inventory_stok_buku_id_seq OWNER TO postgres;

--
-- TOC entry 2187 (class 0 OID 0)
-- Dependencies: 191
-- Name: rak_inventory_stok_buku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE rak_inventory_stok_buku_id_seq OWNED BY rak_inventory_stok_buku.id;


--
-- TOC entry 198 (class 1259 OID 29877)
-- Name: transaksi_peminjaman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE transaksi_peminjaman (
    id integer NOT NULL,
    id_mahasiswa integer NOT NULL,
    tanggal_peminjaman date,
    tanggal_pengembalian date,
    status_pengembalian integer DEFAULT 0 NOT NULL
);


ALTER TABLE transaksi_peminjaman OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 29875)
-- Name: transaksi_peminjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE transaksi_peminjaman_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transaksi_peminjaman_id_seq OWNER TO postgres;

--
-- TOC entry 2188 (class 0 OID 0)
-- Dependencies: 197
-- Name: transaksi_peminjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE transaksi_peminjaman_id_seq OWNED BY transaksi_peminjaman.id;


--
-- TOC entry 2036 (class 2604 OID 29846)
-- Name: history_peminjaman id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY history_peminjaman ALTER COLUMN id SET DEFAULT nextval('history_peminjaman_id_seq'::regclass);


--
-- TOC entry 2033 (class 2604 OID 29804)
-- Name: master_buku id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY master_buku ALTER COLUMN id SET DEFAULT nextval('master_buku_id_seq'::regclass);


--
-- TOC entry 2034 (class 2604 OID 29812)
-- Name: master_mahasiswa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY master_mahasiswa ALTER COLUMN id SET DEFAULT nextval('master_mahasiswa_id_seq'::regclass);


--
-- TOC entry 2035 (class 2604 OID 29833)
-- Name: rak_inventory_stok_buku id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rak_inventory_stok_buku ALTER COLUMN id SET DEFAULT nextval('rak_inventory_stok_buku_id_seq'::regclass);


--
-- TOC entry 2037 (class 2604 OID 29880)
-- Name: transaksi_peminjaman id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transaksi_peminjaman ALTER COLUMN id SET DEFAULT nextval('transaksi_peminjaman_id_seq'::regclass);


--
-- TOC entry 2174 (class 0 OID 29843)
-- Dependencies: 194
-- Data for Name: history_peminjaman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY history_peminjaman (id, id_transaksi, id_buku, jumlah, tanggal_peminjaman, tanggal_pengembalian) FROM stdin;
17	9	8	1	2024-04-07	2024-04-09
18	9	10	1	2024-04-07	2024-04-09
19	9	11	1	2024-04-07	2024-04-09
\.


--
-- TOC entry 2189 (class 0 OID 0)
-- Dependencies: 193
-- Name: history_peminjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('history_peminjaman_id_seq', 19, true);


--
-- TOC entry 2168 (class 0 OID 29801)
-- Dependencies: 188
-- Data for Name: master_buku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY master_buku (id, judul, penulis, penerbit, tahun_terbit) FROM stdin;
8	dsf	fdsf	fdsf	2026
9	sdfdsf	fdsf	fsdfdsf	2026
10	dewd	dewd	dewd	2029
11	hjh	hjh	hh	2031
25	ddsf	fdsf	fdsfdsf	1994
26	dsfdsf	fsdf	fdsfdsf	1994
27	Ber	Berak	berak	1993
28	fdsf	fdsf	fdsf	1993
29	cebok	cebok	cebok	1992
30	fdsf	fdsf	fdsf	1992
31	cepirit	cepirit	cepirit	1991
24	One piece	Echiro Oda	Sidu	2023
\.


--
-- TOC entry 2190 (class 0 OID 0)
-- Dependencies: 187
-- Name: master_buku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('master_buku_id_seq', 31, true);


--
-- TOC entry 2170 (class 0 OID 29809)
-- Dependencies: 190
-- Data for Name: master_mahasiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY master_mahasiswa (id, nama, nim, jurusan, tanggal_lahir) FROM stdin;
2	Abdul Rosid	1213213	Informatika	1994-04-05
3	Abdul Somad	124564	Desgin grafis xxx	2020-01-01
4	Abizar	56576	Tes	2024-04-01
5	Assyfa	46567	tes	2024-04-01
6	nurdin	67678	tes	2024-04-02
7	nada	324324	sdsad	2024-04-01
\.


--
-- TOC entry 2191 (class 0 OID 0)
-- Dependencies: 189
-- Name: master_mahasiswa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('master_mahasiswa_id_seq', 7, true);


--
-- TOC entry 2172 (class 0 OID 29830)
-- Dependencies: 192
-- Data for Name: rak_inventory_stok_buku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY rak_inventory_stok_buku (id, id_buku, nama_rak, jumlah, kondisi) FROM stdin;
2	24	A	10	\N
3	11	B	12	\N
\.


--
-- TOC entry 2192 (class 0 OID 0)
-- Dependencies: 191
-- Name: rak_inventory_stok_buku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('rak_inventory_stok_buku_id_seq', 3, true);


--
-- TOC entry 2176 (class 0 OID 29877)
-- Dependencies: 198
-- Data for Name: transaksi_peminjaman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY transaksi_peminjaman (id, id_mahasiswa, tanggal_peminjaman, tanggal_pengembalian, status_pengembalian) FROM stdin;
9	2	2024-04-07	2024-04-09	0
\.


--
-- TOC entry 2193 (class 0 OID 0)
-- Dependencies: 197
-- Name: transaksi_peminjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('transaksi_peminjaman_id_seq', 9, true);


--
-- TOC entry 2046 (class 2606 OID 29848)
-- Name: history_peminjaman history_peminjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY history_peminjaman
    ADD CONSTRAINT history_peminjaman_pkey PRIMARY KEY (id);


--
-- TOC entry 2040 (class 2606 OID 29806)
-- Name: master_buku master_buku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY master_buku
    ADD CONSTRAINT master_buku_pkey PRIMARY KEY (id);


--
-- TOC entry 2042 (class 2606 OID 29814)
-- Name: master_mahasiswa master_mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY master_mahasiswa
    ADD CONSTRAINT master_mahasiswa_pkey PRIMARY KEY (id);


--
-- TOC entry 2044 (class 2606 OID 29835)
-- Name: rak_inventory_stok_buku rak_inventory_stok_buku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rak_inventory_stok_buku
    ADD CONSTRAINT rak_inventory_stok_buku_pkey PRIMARY KEY (id);


--
-- TOC entry 2048 (class 2606 OID 29882)
-- Name: transaksi_peminjaman transaksi_peminjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transaksi_peminjaman
    ADD CONSTRAINT transaksi_peminjaman_pkey PRIMARY KEY (id);


--
-- TOC entry 2049 (class 2606 OID 29836)
-- Name: rak_inventory_stok_buku rak_inventory_stok_buku_id_buku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rak_inventory_stok_buku
    ADD CONSTRAINT rak_inventory_stok_buku_id_buku_fkey FOREIGN KEY (id_buku) REFERENCES master_buku(id);


-- Completed on 2024-04-07 16:05:28

--
-- PostgreSQL database dump complete
--

