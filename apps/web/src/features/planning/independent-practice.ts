export function formatIndependentPracticeContent(content: string): string {
  if (/^### Your task/mu.test(content)) {
    return content;
  }

  const legacyGoal = content.match(/Real-world goal:\s*(.+?)\.\s*Speaking task/isu)?.[1]?.trim();

  if (legacyGoal !== undefined) {
    return [
      "### Your task",
      `Complete one practical response to ${legacyGoal}.`,
      "### Steps",
      "1. Write the situation and two important details.",
      "2. Write a short response using the lesson vocabulary.",
      "3. Use one grammar pattern from this lesson.",
      "4. Add one question or clear next step.",
      "5. Read your answer once and correct anything unclear.",
      "### What to save",
      "Save your final written response. Recording a second version is optional."
    ].join("\n\n");
  }

  const instructions = content
    .split(/(?<=[.!?])\s+(?=[A-Z])/u)
    .map((instruction) => instruction.trim())
    .filter(Boolean);
  const [task = content, ...steps] = instructions;

  if (steps.length === 0) {
    return `### Your task\n\n${task}`;
  }

  return [
    "### Your task",
    task,
    "### Steps",
    ...steps.map((step, index) => `${index + 1}. ${step}`)
  ].join("\n\n");
}
