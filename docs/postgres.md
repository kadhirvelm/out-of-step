-- public.account definition

-- Drop table

-- DROP TABLE public.account;

CREATE TABLE public.account (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"hashedPassword" text NOT NULL,
	email text NOT NULL,
	"name" text NOT NULL,
	username text NOT NULL,
	"cashOnHand" float8 NOT NULL,
	"portfolioName" text NOT NULL,
	CONSTRAINT account_pkey PRIMARY KEY (id)
);


-- public.stock definition

-- Drop table

-- DROP TABLE public.stock;

CREATE TABLE public.stock (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	status text NOT NULL,
	"totalQuantity" int4 NOT NULL,
	CONSTRAINT stock_check CHECK (((status = 'available'::text) OR (status = 'acquired'::text))),
	CONSTRAINT stock_pk PRIMARY KEY (id)
);


-- public."dividendHistory" definition

-- Drop table

-- DROP TABLE public."dividendHistory";

CREATE TABLE public."dividendHistory" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"payoutPerShare" float8 NOT NULL,
	"timestamp" date NOT NULL DEFAULT now(),
	stock uuid NOT NULL,
	CONSTRAINT dividendpayout_check CHECK (("payoutPerShare" > (0.01)::double precision)),
	CONSTRAINT dividendpayout_pk PRIMARY KEY (id),
	CONSTRAINT dividendhistory_fk FOREIGN KEY (stock) REFERENCES stock(id)
);


-- public."limitOrder" definition

-- Drop table

-- DROP TABLE public."limitOrder";

CREATE TABLE public."limitOrder" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	account uuid NOT NULL,
	quantity int4 NOT NULL,
	stock uuid NOT NULL,
	"sellAtPrice" float8 NOT NULL,
	"timestamp" date NOT NULL DEFAULT now(),
	status text NOT NULL,
	CONSTRAINT limitorder_check CHECK (((status = 'PENDING'::text) OR (status = 'EXECUTED'::text) OR (status = 'CANCELLED'::text))),
	CONSTRAINT limitorder_pk PRIMARY KEY (id),
	CONSTRAINT "quantity greater than 0" CHECK ((quantity > 0)),
	CONSTRAINT "sell at price greater than 0" CHECK (("sellAtPrice" > (0.01)::double precision)),
	CONSTRAINT limitorder_fk FOREIGN KEY (account) REFERENCES account(id),
	CONSTRAINT limitorder_fk_1 FOREIGN KEY (stock) REFERENCES stock(id)
);
CREATE INDEX limitorder_account_idx ON public."limitOrder" USING btree (account);
CREATE INDEX limitorder_status_idx ON public."limitOrder" USING btree (status);


-- public."ownedStock" definition

-- Drop table

-- DROP TABLE public."ownedStock";

CREATE TABLE public."ownedStock" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	account uuid NOT NULL,
	quantity int4 NOT NULL,
	stock uuid NOT NULL,
	CONSTRAINT ownedvolume_check CHECK ((quantity > 0)),
	CONSTRAINT ownedvolume_pk PRIMARY KEY (id),
	CONSTRAINT ownedstock_fk FOREIGN KEY (account) REFERENCES account(id),
	CONSTRAINT ownedvolume_fk_1 FOREIGN KEY (stock) REFERENCES stock(id)
);
CREATE INDEX ownedstock_account_idx ON public."ownedStock" USING btree (account);
CREATE INDEX ownedstock_stock_idx ON public."ownedStock" USING btree (stock);


-- public."priceHistory" definition

-- Drop table

-- DROP TABLE public."priceHistory";

CREATE TABLE public."priceHistory" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"dollarValue" float8 NOT NULL,
	"timestamp" date NOT NULL DEFAULT now(),
	stock uuid NOT NULL,
	CONSTRAINT pricepoint_check CHECK (("dollarValue" > (0.01)::double precision)),
	CONSTRAINT pricepoint_pk PRIMARY KEY (id),
	CONSTRAINT pricehistory_fk FOREIGN KEY (stock) REFERENCES stock(id)
);
CREATE INDEX pricehistory_stockid_idx ON public."priceHistory" USING btree (stock);


-- public."transactionHistory" definition

-- Drop table

-- DROP TABLE public."transactionHistory";

CREATE TABLE public."transactionHistory" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"timestamp" date NOT NULL DEFAULT now(),
	"type" text NOT NULL,
	"priceHistory" uuid NULL,
	"purchasedQuantity" int4 NULL,
	"soldQuantity" int4 NULL,
	"dividendHistory" uuid NULL,
	quantity int4 NULL,
	"limitOrder" uuid NULL,
	"acquiredQuantity" int4 NULL,
	account uuid NOT NULL,
	CONSTRAINT transaction_check CHECK (((type = 'exchange-transaction'::text) OR (type = 'dividend-transaction'::text) OR (type = 'acquisition-transaction'::text))),
	CONSTRAINT transaction_check_1 CHECK ((("purchasedQuantity" > 0) OR ("purchasedQuantity" IS NULL))),
	CONSTRAINT transaction_check_2 CHECK ((("soldQuantity" > 0) OR ("soldQuantity" IS NULL))),
	CONSTRAINT transaction_check_3 CHECK (((quantity > 0) OR (quantity IS NULL))),
	CONSTRAINT transaction_pk PRIMARY KEY (id),
	CONSTRAINT transactionhistory_check_4 CHECK (("acquiredQuantity" > 0)),
	CONSTRAINT transaction_fk FOREIGN KEY ("limitOrder") REFERENCES "limitOrder"(id),
	CONSTRAINT transaction_fk_1 FOREIGN KEY ("priceHistory") REFERENCES "priceHistory"(id),
	CONSTRAINT transaction_fk_2 FOREIGN KEY ("dividendHistory") REFERENCES "dividendHistory"(id),
	CONSTRAINT transactionhistory_fk FOREIGN KEY (account) REFERENCES account(id)
);
CREATE INDEX transactionhistory_account_idx ON public."transactionHistory" USING btree (account);