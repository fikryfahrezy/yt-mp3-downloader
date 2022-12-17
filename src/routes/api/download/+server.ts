import type { RequestHandler } from './$types';

import { error } from '@sveltejs/kit';
import ytdl from 'ytdl-core';

export const GET = (async ({ url }) => {
	const ytUrl = url.searchParams.get('yturl') || '';
	const ytInfo = await ytdl.getInfo(ytUrl);
	const ytTitle = ytInfo.videoDetails.title;

	const audioFormats = ytdl.filterFormats(ytInfo.formats, 'audioonly');
	const format = ytdl.chooseFormat(audioFormats, { quality: 'lowestaudio' });

	const contentLength = format.contentLength;
	const maxContentLength = 10000000;

	if (Number(contentLength) > maxContentLength) {
		throw error(400, `max content length is ${maxContentLength}`);
	}

	const stream = new ReadableStream({
		start(controller) {
			ytdl(ytUrl, {
				format
			})
				.on('data', (chunk) => {
					controller.enqueue(chunk);
				})
				.on('close', () => {
					controller.close();
				})
				.on('end', () => {
					controller.close();
				})
				.on('error', (err) => {
					controller.error(err);
				});
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'audio/mpeg',
			'Content-Disposition': `attachment; filename=${ytTitle}.mp3`,
			'Content-Length': contentLength
		}
	});
}) satisfies RequestHandler;
