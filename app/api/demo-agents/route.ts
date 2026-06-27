import { demoAgents } from "@/lib/data/demo-agents";

export async function GET() {
  return Response.json({ agents: demoAgents });
}
