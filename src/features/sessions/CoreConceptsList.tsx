import Card from "@/components/ui/Card";

interface CoreConceptsListProps {
  concepts: string[];
}

export default function CoreConceptsList({ concepts }: CoreConceptsListProps) {
  return (
    <Card className="mb-5">
      <h2 className="font-semibold text-gray-900 mb-3">Core Concepts</h2>
      <ul className="space-y-2">
        {concepts.map((concept, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-sm bg-indigo-500 shrink-0 mt-1.5" />
            <span className="text-sm text-gray-700 leading-relaxed">{concept}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
