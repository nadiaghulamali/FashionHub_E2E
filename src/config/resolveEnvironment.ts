import dns from "dns/promises";

type EnvKey = "LOCAL" | "STAGING" | "PRODUCTION";

export async function resolveBaseUrl(): Promise<string> {
  const env = (process.env.ENVIRONMENT?.toUpperCase() || "PRODUCTION") as EnvKey;

  const urls: Record<EnvKey, string | undefined> = {
    LOCAL: process.env.LOCAL_URL,
    STAGING: process.env.STAGING_URL,
    PRODUCTION: process.env.PRODUCTION_URL,
  };

  // fallback to PRODUCTION if missing
  const target = urls[env] ?? urls.PRODUCTION!;

  try {
    const hostname = new URL(target).hostname;
    await dns.lookup(hostname);
    return target; 
  } catch {
    console.warn(`Environment ${env} unreachable → falling back to PRODUCTION`);
    return urls.PRODUCTION!;
  }
}
