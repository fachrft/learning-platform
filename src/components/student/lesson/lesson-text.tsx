interface LessonTextProps {
  content: string;
}

export function LessonText({ content }: LessonTextProps) {
  if (!content) return null;

  return (
    <div
      className="ProseMirror prose-sm md:prose-base dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
