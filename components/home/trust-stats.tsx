import { StatsBand } from "@/components/shared/stats-band";
import type { BlockData } from "@/lib/content/blocks";

export function TrustStats({ content }: { content: BlockData<"home.trustStats"> }) {
  return <StatsBand stats={content.stats} />;
}
