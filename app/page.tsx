import { connection } from "next/server";
import { Homepage } from "@/features/homepage/homepage";

export default async function Home() {
  await connection();
  return <Homepage />;
}
