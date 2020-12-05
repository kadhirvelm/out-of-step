-- public.portfolio definition

-- Drop table

-- DROP TABLE public.portfolio;

CREATE TABLE public.portfolio (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"cashOnHand" int4 NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT portfolio_check CHECK (("cashOnHand" > 0)),
	CONSTRAINT portfolio_pkey PRIMARY KEY (id)
);


-- public."portfolio_limitOrder" definition

-- Drop table

-- DROP TABLE public."portfolio_limitOrder";

CREATE TABLE public."portfolio_limitOrder" (
	portfolio uuid NOT NULL,
	"limitOrder" uuid NOT NULL,
	CONSTRAINT "_portfolio_limitOrder__un" UNIQUE (portfolio, "limitOrder")
);
CREATE INDEX portfolio_limitorder_limitorder_idx ON public."portfolio_limitOrder" USING btree ("limitOrder");
CREATE INDEX portfolio_limitorder_portfolio_idx ON public."portfolio_limitOrder" USING btree (portfolio);


-- public."portfolio_ownedVolume" definition

-- Drop table

-- DROP TABLE public."portfolio_ownedVolume";

CREATE TABLE public."portfolio_ownedVolume" (
	portfolio uuid NOT NULL,
	"ownedVolume" uuid NOT NULL,
	CONSTRAINT portfolio_ownedvolumes_un UNIQUE (portfolio, "ownedVolume")
);
CREATE INDEX portfolio_ownedvolumes_ownedvolume_idx ON public."portfolio_ownedVolume" USING btree ("ownedVolume");
CREATE INDEX portfolio_ownedvolumes_portfolio_idx ON public."portfolio_ownedVolume" USING btree (portfolio);


-- public."portfolio_transactionHistory" definition

-- Drop table

-- DROP TABLE public."portfolio_transactionHistory";

CREATE TABLE public."portfolio_transactionHistory" (
	portfolio uuid NOT NULL,
	"transactionHistory" uuid NOT NULL,
	CONSTRAINT "_portfolio_transactions__un" UNIQUE (portfolio, "transactionHistory")
);
CREATE INDEX portfolio_transactionhistory_portfolio_idx ON public."portfolio_transactionHistory" USING btree (portfolio);
CREATE INDEX portfolio_transactionhistory_transaction_idx ON public."portfolio_transactionHistory" USING btree ("transactionHistory");


-- public.volume definition

-- Drop table

-- DROP TABLE public.volume;

CREATE TABLE public.volume (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"totalQuantity" int4 NOT NULL,
	CONSTRAINT volume_check CHECK (("totalQuantity" > 0)),
	CONSTRAINT volume_pk PRIMARY KEY (id)
);


-- public."volume_ownedVolume" definition

-- Drop table

-- DROP TABLE public."volume_ownedVolume";

CREATE TABLE public."volume_ownedVolume" (
	volume uuid NOT NULL,
	"ownedVolume" uuid NOT NULL,
	CONSTRAINT volume_ownedvolume_un UNIQUE (volume, "ownedVolume")
);
CREATE INDEX volume_ownedvolume_ownedvolume_idx ON public."volume_ownedVolume" USING btree ("ownedVolume");
CREATE INDEX volume_ownedvolume_volume_idx ON public."volume_ownedVolume" USING btree (volume);


-- public.account definition

-- Drop table

-- DROP TABLE public.account;

CREATE TABLE public.account (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"hashedPassword" text NOT NULL,
	email text NOT NULL,
	"name" text NOT NULL,
	portfolio uuid NOT NULL,
	username text NOT NULL,
	CONSTRAINT account_pkey PRIMARY KEY (id),
	CONSTRAINT account_fk FOREIGN KEY (portfolio) REFERENCES portfolio(id) ON UPDATE CASCADE ON DELETE SET NULL
);


-- public.stock definition

-- Drop table

-- DROP TABLE public.stock;

CREATE TABLE public.stock (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	status text NOT NULL,
	volume uuid NOT NULL,
	CONSTRAINT stock_check CHECK (((status = 'available'::text) OR (status = 'acquired'::text))),
	CONSTRAINT stock_pk PRIMARY KEY (id),
	CONSTRAINT stock_fk_2 FOREIGN KEY (volume) REFERENCES volume(id)
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
	portfolio uuid NOT NULL,
	quantity int4 NOT NULL,
	stock uuid NOT NULL,
	"sellAtPrice" float8 NOT NULL,
	"timestamp" date NOT NULL DEFAULT now(),
	"transactionHistory" uuid NULL,
	CONSTRAINT limitorder_pk PRIMARY KEY (id),
	CONSTRAINT "quantity greater than 0" CHECK ((quantity > 0)),
	CONSTRAINT "sell at price greater than 0" CHECK (("sellAtPrice" > (0.01)::double precision)),
	CONSTRAINT limitorder_fk FOREIGN KEY (portfolio) REFERENCES portfolio(id),
	CONSTRAINT limitorder_fk_1 FOREIGN KEY (stock) REFERENCES stock(id)
);


-- public."ownedVolume" definition

-- Drop table

-- DROP TABLE public."ownedVolume";

CREATE TABLE public."ownedVolume" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	portfolio uuid NOT NULL,
	quantity int4 NOT NULL,
	stock uuid NOT NULL,
	CONSTRAINT ownedvolume_check CHECK ((quantity > 0)),
	CONSTRAINT ownedvolume_pk PRIMARY KEY (id),
	CONSTRAINT ownedvolume_fk FOREIGN KEY (portfolio) REFERENCES portfolio(id),
	CONSTRAINT ownedvolume_fk_1 FOREIGN KEY (stock) REFERENCES stock(id)
);


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
	portfolio uuid NOT NULL,
	"acquiredQuantity" int4 NULL,
	CONSTRAINT transaction_check CHECK (((type = 'exchange-transaction'::text) OR (type = 'dividend-transaction'::text) OR (type = 'acquisition-transaction'::text))),
	CONSTRAINT transaction_check_1 CHECK ((("purchasedQuantity" > 0) OR ("purchasedQuantity" IS NULL))),
	CONSTRAINT transaction_check_2 CHECK ((("soldQuantity" > 0) OR ("soldQuantity" IS NULL))),
	CONSTRAINT transaction_check_3 CHECK (((quantity > 0) OR (quantity IS NULL))),
	CONSTRAINT transaction_pk PRIMARY KEY (id),
	CONSTRAINT transactionhistory_check_4 CHECK (("acquiredQuantity" > 0)),
	CONSTRAINT transaction_fk FOREIGN KEY ("limitOrder") REFERENCES "limitOrder"(id),
	CONSTRAINT transaction_fk_1 FOREIGN KEY ("priceHistory") REFERENCES "priceHistory"(id),
	CONSTRAINT transaction_fk_2 FOREIGN KEY ("dividendHistory") REFERENCES "dividendHistory"(id)
);
