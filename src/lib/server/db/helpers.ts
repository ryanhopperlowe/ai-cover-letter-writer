import {
	boolean,
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	type PgColumnBuilderBase
} from 'drizzle-orm/pg-core';

const BaseColumns = {
	id: uuid('id').primaryKey().generatedAlwaysAs('gen_random_uuid()'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
} as const;
type BaseColumns = typeof BaseColumns;

const baseTable = <TName extends string, TColumns extends Record<string, PgColumnBuilderBase>>(
	name: TName,
	columns: TColumns
) => {
	return pgTable(name, {
		...columns,
		...BaseColumns
	});
};

export const Orm = {
	table: baseTable,
	text: text,
	timestamp: timestamp,
	uuid: uuid,
	int: integer,
	float: decimal,
	boolean: boolean
};
