CREATE TABLE "cover_letter_resumes" (
	"coverLetterId" uuid,
	"resumeId" uuid,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cover_letter" (
	"content" text NOT NULL,
	"jobListing" uuid,
	"userId" uuid NOT NULL,
	"copiedFromId" uuid,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_listing" (
	"title" text NOT NULL,
	"companyName" text NOT NULL,
	"content" text NOT NULL,
	"hiringManager" text,
	"mission" text,
	"address" text,
	"userId" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product" (
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"image" text NOT NULL,
	"stripe_product_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "product_name_unique" UNIQUE("name"),
	CONSTRAINT "product_stripe_product_id_unique" UNIQUE("stripe_product_id"),
	CONSTRAINT "product_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"name" text NOT NULL,
	"tags" text,
	"bucketPath" text NOT NULL,
	"userId" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"tokens" integer DEFAULT 0 NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cover_letter_resumes" ADD CONSTRAINT "cover_letter_resumes_coverLetterId_cover_letter_id_fk" FOREIGN KEY ("coverLetterId") REFERENCES "public"."cover_letter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letter_resumes" ADD CONSTRAINT "cover_letter_resumes_resumeId_resume_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."resume"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letter" ADD CONSTRAINT "cover_letter_jobListing_job_listing_id_fk" FOREIGN KEY ("jobListing") REFERENCES "public"."job_listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letter" ADD CONSTRAINT "cover_letter_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_listing" ADD CONSTRAINT "job_listing_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;