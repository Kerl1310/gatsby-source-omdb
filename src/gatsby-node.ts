import fetch from 'node-fetch';
import { createFileNodeFromBuffer } from 'gatsby-source-filesystem';
import { OmdbNode } from './nodes';

import { omdbGetByTitleResponse } from './omdb-api';

export interface PluginOptions {
    // Auth
    apiKey: string;

    // Config
    text: string;
    type?: string;
    yearOfRelease?: number;
    returnType?: string;
    plot?: string;
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

    const { omdbResults } = await omdbGetByTitleResponse(
        pluginOptions
    );

    await Promise.all([
        ...omdbResults.map(async (result, index) => {
            createNode(
                OmdbNode({
                    ...result,
                    imdbId: `${result.imdbId}`,
                    order: index,
                    title: `${result.Title}`,
                    plot: `${result.Plot}`,
                    type: `${result.Type}`,
                    imdbRating: `${result.ImdbRating}`,
                    poster:
                        result.Poster
                            ? await referenceRemoteFile(
                                result.Poster,
                                result.Poster,
                                helpers,
                            )
                            : null,
                }),
            );
        })]);

        return;
    };