CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  processor text NOT NULL,
  city text NOT NULL,
  bin text NOT NULL,
  last4 text NOT NULL,
  balance numeric NOT NULL,
  price numeric NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact text NOT NULL,
  contact_type text NOT NULL DEFAULT 'email',
  amount numeric NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can place an order"
  ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.products (brand, processor, city, bin, last4, balance, price, in_stock) VALUES
('VISA','CARDNAV','Jackson, MS','434256','3178',574.18,64,true),
('MASTERCARD','BRELLA','Birmingham, AL','533248','8091',662.44,72,true),
('DISCOVER','CARDNAV','Toledo, OH','601120','4417',388.90,44,true),
('VISA','CARDNAV','Houston, TX','434769','8843',2665.74,295,true),
('VISA','BRELLA','Fresno, CA','414720','2290',1204.60,132,true),
('MASTERCARD','CORECARD','Akron, OH','541234','7761',915.32,100,true),
('DISCOVER','BRELLA','Mobile, AL','601100','1029',452.11,48,false),
('VISA','CARDNAV','Shreveport, LA','433017','5580',3180.05,350,true),
('MASTERCARD','BRELLA','Memphis, TN','512106','6634',780.90,85,true),
('VISA','CORECARD','Tulsa, OK','446542','9917',1870.44,207,true),
('DISCOVER','CARDNAV','Dayton, OH','601124','3352',640.18,72,true),
('MASTERCARD','BRELLA','Little Rock, AR','526219','7108',1102.77,121,false),
('VISA','CARDNAV','Columbus, GA','438857','2264',505.30,57,true),
('VISA','BRELLA','Phoenix, AZ','424631','8890',4210.60,462,true),
('MASTERCARD','CARDNAV','Detroit, MI','533914','4471',298.55,34,true),
('DISCOVER','CORECARD','Tampa, FL','601188','5523',1455.90,161,true),
('VISA','CARDNAV','Baton Rouge, LA','431305','6718',860.24,95,true),
('MASTERCARD','BRELLA','Kansas City, MO','552344','1180',2320.18,255,true),
('VISA','CORECARD','Denver, CO','445612','9042',1015.70,113,false),
('DISCOVER','CARDNAV','Cleveland, OH','601177','8265',375.60,43,true),
('VISA','BRELLA','San Antonio, TX','414709','3391',5120.44,564,true),
('MASTERCARD','CARDNAV','Jacksonville, FL','538712','7704',690.05,75,true),
('VISA','CARDNAV','Las Vegas, NV','433904','2218',1640.32,179,true),
('DISCOVER','BRELLA','Richmond, VA','601109','6690',820.11,89,true),
('MASTERCARD','CORECARD','Milwaukee, WI','517805','4436',1290.60,143,false),
('VISA','CARDNAV','Oklahoma City, OK','438240','1157',460.90,50,true),
('VISA','BRELLA','Atlanta, GA','424009','8873',3455.28,379,true),
('MASTERCARD','CARDNAV','Nashville, TN','544619','5502',975.44,108,true),
('DISCOVER','CORECARD','Omaha, NE','601191','3320',588.70,63,true),
('VISA','CARDNAV','Chicago, IL','435418','7796',2044.90,224,true);