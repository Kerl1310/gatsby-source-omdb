import fetch from 'node-fetch';
import { PluginOptions } from './gatsby-node';
import { OmdbResponse } from './types/OmdbResponse';

export const OMDB_API_URL = 'http://www.omdb.com/';

const getByTitle = async (
    apiKey: string,
    title: string,
    type: 'movie' | 'series' | 'episode' = 'movie',
    yearOfRelease: number = null,
    returnType: 'json' = 'json', // Omdb Api accepts xml too,
    plot: 'short' | 'full' = 'full',
    version: number = 1
) => {
    const url = new URL(OMDB_API_URL);
    url.searchParams.append('apikey', apiKey);
    url.searchParams.append('t', title);
    url.searchParams.append('type', type);
    url.searchParams.append('y', yearOfRelease.toString());
    url.searchParams.append('r', returnType);
    url.searchParams.append('plot', plot);
    url.searchParams.append('v', version.toString());

    const response = await fetch(String(url));

    if (!response.ok) {
        throw new Error(
            `[${url} | ${apiKey}] ${
            response.statusText
            }: ${await response.text()}`,
        );
    }

    const result: OmdbResponse = await response.json();
    return result.items;
};

export const omdbGetByTitleResponse: OmdbResponse = async(apiKey, text, type) => {
    return await getByTitle(apiKey, text, type)
};
