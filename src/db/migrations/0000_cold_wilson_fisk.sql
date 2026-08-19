CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`local_uri` text NOT NULL,
	`ocr_text` text,
	`parsed_json` text,
	`status` text NOT NULL,
	`captured_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`fx_rate` real NOT NULL,
	`charged_at` text NOT NULL,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`fx_rate` real NOT NULL,
	`cycle` text NOT NULL,
	`next_charge_at` text NOT NULL,
	`status` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL
);
