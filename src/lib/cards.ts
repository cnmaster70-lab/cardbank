export type CardTier = "STARTER" | "MID" | "PREMIUM";

export type EnrollCard = {
  id: string;
  brand: "VISA" | "MASTERCARD" | "DISCOVER";
  processor: "CARDNAV" | "BRELLA" | "CORECARD";
  tier: CardTier;
  city: string;
  bin: string;
  last4: string;
  balance: number;
  price: number;
  inStock: boolean;
};

const raw: Array<[EnrollCard["brand"], EnrollCard["processor"], string, string, string, number, number, boolean]> = [
  ["VISA", "CARDNAV", "Jackson, MS", "434256", "3178", 574.18, 46, true],
  ["MASTERCARD", "BRELLA", "Birmingham, AL", "533248", "8091", 662.44, 53, true],
  ["DISCOVER", "CARDNAV", "Toledo, OH", "601120", "4417", 388.9, 32, true],
  ["VISA", "CARDNAV", "Houston, TX", "434769", "8843", 2665.74, 147, true],
  ["VISA", "BRELLA", "Fresno, CA", "414720", "2290", 1204.6, 88, true],
  ["MASTERCARD", "CORECARD", "Akron, OH", "541234", "7761", 915.32, 71, true],
  ["DISCOVER", "BRELLA", "Mobile, AL", "601100", "1029", 452.11, 38, false],
  ["VISA", "CARDNAV", "Shreveport, LA", "433017", "5580", 3180.05, 172, true],
  ["MASTERCARD", "BRELLA", "Memphis, TN", "512106", "6634", 780.9, 62, true],
  ["VISA", "CORECARD", "Tulsa, OK", "446542", "9917", 1870.44, 119, true],
  ["DISCOVER", "CARDNAV", "Dayton, OH", "601124", "3352", 640.18, 51, true],
  ["MASTERCARD", "BRELLA", "Little Rock, AR", "526219", "7108", 1102.77, 84, false],
  ["VISA", "CARDNAV", "Columbus, GA", "438857", "2264", 505.3, 41, true],
  ["VISA", "BRELLA", "Phoenix, AZ", "424631", "8890", 4210.6, 214, true],
  ["MASTERCARD", "CARDNAV", "Detroit, MI", "533914", "4471", 298.55, 27, true],
  ["DISCOVER", "CORECARD", "Tampa, FL", "601188", "5523", 1455.9, 99, true],
  ["VISA", "CARDNAV", "Baton Rouge, LA", "431305", "6718", 860.24, 67, true],
  ["MASTERCARD", "BRELLA", "Kansas City, MO", "552344", "1180", 2320.18, 134, true],
  ["VISA", "CORECARD", "Denver, CO", "445612", "9042", 1015.7, 79, false],
  ["DISCOVER", "CARDNAV", "Cleveland, OH", "601177", "8265", 375.6, 31, true],
  ["VISA", "BRELLA", "San Antonio, TX", "414709", "3391", 5120.44, 262, true],
  ["MASTERCARD", "CARDNAV", "Jacksonville, FL", "538712", "7704", 690.05, 55, true],
  ["VISA", "CARDNAV", "Las Vegas, NV", "433904", "2218", 1640.32, 108, true],
  ["DISCOVER", "BRELLA", "Richmond, VA", "601109", "6690", 820.11, 65, true],
  ["MASTERCARD", "CORECARD", "Milwaukee, WI", "517805", "4436", 1290.6, 92, false],
  ["VISA", "CARDNAV", "Oklahoma City, OK", "438240", "1157", 460.9, 37, true],
  ["VISA", "BRELLA", "Atlanta, GA", "424009", "8873", 3455.28, 186, true],
  ["MASTERCARD", "CARDNAV", "Nashville, TN", "544619", "5502", 975.44, 74, true],
  ["DISCOVER", "CORECARD", "Omaha, NE", "601191", "3320", 588.7, 47, true],
  ["VISA", "CARDNAV", "Chicago, IL", "435418", "7796", 2044.9, 126, true],
];

function tierFor(balance: number): CardTier {
  if (balance >= 2000) return "PREMIUM";
  if (balance >= 900) return "MID";
  return "STARTER";
}

export const CARDS: EnrollCard[] = raw.map(
  ([brand, processor, city, bin, last4, balance, price, inStock], i) => ({
    id: `${bin}-${last4}-${i}`,
    brand,
    processor,
    tier: tierFor(balance),
    city,
    bin,
    last4,
    balance,
    price,
    inStock,
  }),
);

export const PERKS = [
  "Full access login",
  "Instant delivery setup from the owner",
  "100% Apple Pay & Cash App linkable",
  "Pre-made enroll balance",
];

export const BTC_ADDRESS = "bc1q8xfhfwdmtjhqw5s9qpu7nvqdp0mttumrkm5hzl";

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
