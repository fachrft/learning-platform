export function getLessonAccessState(chapters: any[], userProgress: any[]) {
  let previousCompleted = true;
  const computedStatus: Record<
    string,
    { isLocked: boolean; isCompleted: boolean }
  > = {};

  chapters.forEach((chapter) => {
    chapter.lessons.forEach((lesson: any) => {
      const isCompleted = userProgress.some(
        (p) => p.lessonId === lesson.id && p.completed,
      );

      computedStatus[lesson.id] = {
        isLocked: !previousCompleted,
        isCompleted,
      };

      previousCompleted = isCompleted;
    });
  });

  return computedStatus;
}
