import {
    PhotonImage,
    SamplingFilter,
    resize,
    sharpen,
} from '@cf-wasm/photon/workerd';

async function resizeImage(original) {
    let res = await original.arrayBuffer();
    res = new Uint8Array(res);

    const input = PhotonImage.new_from_byteslice(res);

    let output = resize(input, 400, 600, SamplingFilter.Lanczos3);

    sharpen(output);

    let outputBytes = output.get_bytes_webp();
    input.free();
    output.free();

    return outputBytes;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === '/api/get-movies') {
            try {
                const { results } = await env.DB.prepare(
                    'SELECT * FROM movies;',
                ).all();
                return Response.json(results);
            } catch (error) {
                return new Response(error.message, { status: 500 });
            }
        }

        if (url.pathname === '/api/proxy-image') {
            const target = url.searchParams.get('url');

            const object = await env.movie_posters.get(target);

            if (object == null) {
                return new Response('image not found', { status: 404 });
            }

            return new Response(object.body);
        }

        if (url.pathname === '/api/add-image') {
            const target = url.searchParams.get('url');

            const object = await env.movie_posters.get(target);

            if (object !== null) {
                return new Response('Already Added', { status: 200 });
            }

            let res = await fetch(target);
            if (!res.ok) {
                return new Response('Failed to fetch', {
                    status: res.status,
                });
            }

            let outputBytes = await resizeImage(res);

            await env.movie_posters.put(target, outputBytes);

            return new Response('Successfully added', { status: 200 });
        }

        if (url.pathname === '/api/delete-image') {
            const target = url.searchParams.get('url');

            await env.movie_posters.delete(target);

            return new Response('Successfully deleted', { status: 200 });
        }

        if (url.pathname === '/api/add-movie') {
            let title = url.searchParams.get('title');
            let rating = url.searchParams.get('rating');
            let review = url.searchParams.get('review');
            let poster = url.searchParams.get('poster');

            let res = await fetch(poster);
            if (!res.ok) {
                return new Response('Failed to fetch', {
                    status: res.status,
                });
            }

            let outputBytes = await resizeImage(res);

            await env.movie_posters.put(poster, outputBytes);

            try {
                const { results } = await env.DB.prepare(
                    `insert into movies(title, review, poster, rating) values ("${title}", "${review}", "${poster}", ${rating});`,
                ).all();
                return Response.json(results);
            } catch (error) {
                return new Response(error.message, { status: 500 });
            }
        }

        return new Response('Not Founed', { status: 404 });
    },
};
