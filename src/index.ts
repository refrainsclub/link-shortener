import Airtable from 'airtable';
import type { AirtableBase } from 'airtable/lib/airtable_base';

export interface Env {
	AIRTABLE_API_TOKEN: string;
	AIRTABLE_BASE_ID: string;
}

export function extractPath(url: string) {
	return new URL(url).pathname.substring(1);
}

export async function getUrl(base: AirtableBase, path: string): Promise<string | undefined> {
	const all = await base
		.table('links')
		.select({ maxRecords: 1, filterByFormula: `id = "${path}"` })
		.all();

	return all[0]?.get('url')?.toString();
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const path = extractPath(request.url);
		const airtable = new Airtable({ apiKey: env.AIRTABLE_API_TOKEN });

		const url = await getUrl(airtable.base(env.AIRTABLE_BASE_ID), path);
		if (!url) {
			return new Response('The link could not be found', { status: 404 });
		}

		return Response.redirect(url);
	},
};
