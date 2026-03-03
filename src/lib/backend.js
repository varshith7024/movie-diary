import { PhotonImage, SamplingFilter, resize } from '@cf-wasm/photon/workerd';

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
                console.log(error.message);
                return new Response(error.message, { status: 500 });
            }
        }

        if (url.pathname === '/api/proxy-image') {
            const target = url.searchParams.get('url');
            console.log(target);

            const object = await env.movie_posters.get(target);

            if (object == null) {
                return new Response('image not found', { status: 404 });
            }

            console.log('Poster retrieved from R2 bucket');
            return new Response(object.body);
        }

        if (url.pathname === '/api/add-image') {
            const target = url.searchParams.get('url');
            console.log(target);

            const object = await env.movie_posters.get(target);

            if (object !== null) {
                console.log(JSON.stringify(object));
                return new Response('Already Added', { status: 200 });
            }

            let res = await fetch(target);
            if (!res.ok) {
                return new Response('Failed to fetch', {
                    status: res.status,
                });
            }

            res = await res.arrayBuffer();
            res = new Uint8Array(res);

            const input = PhotonImage.new_from_byteslice(res);

            const output = resize(input, 200, 300, SamplingFilter.Nearest);

            let outputBytes = output.get_bytes_webp();
            input.free();
            output.free();

            await env.movie_posters.put(target, outputBytes);

            return new Response('Successfully added', { status: 200 });
        }

        if (url.pathname === '/api/delete-image') {
            const target = url.searchParams.get('url');
            console.log(target);

            await env.movie_posters.delete(target);

            return new Response('Successfully deleted', { status: 200 });
        }

        if (url.pathname === '/api/add-movie') {
            console.log(url);
            let title = url.searchParams.get('title');
            let rating = url.searchParams.get('rating');
            let review = url.searchParams.get('review');
            let poster = url.searchParams.get('poster');

            console.log(
                `insert into movies(title, review, poster, rating) values ("${title}", "${review}", "${poster}", ${rating});`,
            );

            try {
                const { results } = await env.DB.prepare(
                    `insert into movies(title, review, poster, rating) values ("${title}", "${review}", "${poster}", ${rating});`,
                ).all();
                return Response.json(results);
            } catch (error) {
                console.log(error.message);
                return new Response(error.message, { status: 500 });
            }
        }

        return new Response('Not Found', { status: 404 });
    },
};
