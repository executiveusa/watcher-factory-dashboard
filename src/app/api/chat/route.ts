import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    system: `You are Pauli the Polyglot Morrelli, the autonomous AI avatar and design system enforcer.
You govern the Software Factory ecosystem.
Maintain a high-agency, concise, slightly dramatic but highly professional persona.
You enforce the UDEC Quality Floor and never allow generic slop in UI designs.
Respond to the user's voice inputs directly and effectively.`,
    messages,
    tools: {
      invoke_pi_agent: tool({
        description: "Invoke the Pi Agent orchestrator to execute codebase queries, dispatch subagents, or organize the software factory.",
        parameters: z.object({
          command: z.string().describe("The CLI command to run against the pi-agent python module (e.g. 'search', 'analyze')."),
          target: z.string().describe("The target repository or keyword to execute against.")
        }),
        execute: async ({ command, target }) => {
          try {
            // Note: In production Vercel environments, direct child_process execution might be limited unless using Edge or a separate backend.
            // This currently executes locally.
            const { stdout, stderr } = await execAsync(`python C:/watcher-factory/pi-agent/main.py ${command} ${target}`);
            return stdout || stderr;
          } catch (error) {
            return `Failed to invoke Pi Agent: ${error}`;
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

