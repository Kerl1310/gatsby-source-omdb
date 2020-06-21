import fetch from 'node-fetch';
import { createFileNodeFromBuffer } from 'gatsby-source-filesystem';
import { OmdbNode } from './nodes';

import { omdbGetMovieByTitle } from './omdb-api';

export interface PluginOptions {
    // Auth
    apiKey: string;

    // Config
    text: string;
    type?: 'movie' | 'series' | 'episode';
    yearOfRelease?: number;
    returnType?: 'json';
    plot?: 'short' | 'full';
    version?: number;
}

const referenceRemoteFile = async (
    id: string,
    url: string,
    { cache, createNode, createNodeId, touchNode, store },
) => {
    const cachedResult = await cache.get(url);

    if (cachedResult) {
        touchNode({ nodeId: cachedResult });
        return { localFile___NODE: cachedResult };
    }

    const testRes = await fetch(url);

    if (!testRes.ok) {
        console.warn(`[${id}] Image could not be loaded. Skipping...`);
        return null;
    }

    const fileNode = await createFileNodeFromBuffer({
        buffer: await testRes.buffer(),
        store,
        cache,
        createNode,
        createNodeId,
        name: id.replace(/[^a-z0-9]+/gi, '-'),
        ext: '.jpg',
    });

    if (fileNode) {
        cache.set(url, fileNode.id);
        return { localFile___NODE: fileNode.id };
    }

    return null;
};

export const sourceNodes = async (
    { actions, createNodeId, store, cache },
    pluginOptions: PluginOptions,
) => {
    const { createNode, touchNode } = actions;
    const helpers = { cache, createNode, createNodeId, store, touchNode };

    const omdbResults = await omdbGetMovieByTitle(
        pluginOptions
    );

    await createNode(
                OmdbNode({
                    imdbId: `${omdbResults.imdbId}`,
                    title: `${omdbResults.title}`,
                    plot: `${omdbResults.plot}`,
                    type: `${omdbResults.type}`,
                    imdbRating: `${omdbResults.imdbRating}`,
                    poster:
                        omdbResults.poster
                            ? await referenceRemoteFile(
                                omdbResults.poster.toString(),
                                omdbResults.poster.toString(),
                                helpers,
                            )
                            : null,
                }),
            );
            return;
        };
