ALTER TABLE "product" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product" CASCADE;--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_product_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" ALTER COLUMN "productId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "checkoutSessionId" text;