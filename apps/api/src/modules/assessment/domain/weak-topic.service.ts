import { Injectable } from "@nestjs/common";

export interface TopicScore {
  readonly tags: readonly string[];
  readonly score: number | null;
  readonly points: number;
}

@Injectable()
export class WeakTopicService {
  public weakTopics(scores: readonly TopicScore[]): readonly string[] {
    const totals = new Map<string, { earned: number; possible: number }>();

    for (const score of scores) {
      if (score.score === null || score.points <= 0) {
        continue;
      }

      for (const tag of score.tags) {
        const current = totals.get(tag) ?? { earned: 0, possible: 0 };
        totals.set(tag, {
          earned: current.earned + score.score,
          possible: current.possible + score.points
        });
      }
    }

    return [...totals.entries()]
      .filter(([, total]) => total.possible > 0 && total.earned / total.possible < 0.7)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([tag]) => tag);
  }
}
