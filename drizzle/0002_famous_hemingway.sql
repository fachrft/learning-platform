ALTER TABLE "chapters" ALTER COLUMN "sortOrder" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "sortOrder" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "sortOrder" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "points" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "sortOrder" SET NOT NULL;