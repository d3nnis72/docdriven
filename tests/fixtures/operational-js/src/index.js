const requiredEnv = ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY", "STRIPE_SECRET_KEY"];

if (process.argv.includes("--doctor")) {
  const missing = requiredEnv.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

console.log("operational fixture ready");
