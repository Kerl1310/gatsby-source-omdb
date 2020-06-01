import fetch from 'node-fetch';
import { PluginOptions } from './gatsby-node';
import { Movie } from './types/omdb-movie';

export const OMDB_API_URL = 'http://www.omdb.com/';

const getByTitle = async (
    apiKey: string,
    title: string,
    type: 'movie' | 'series' | 'episode' = 'movie',
    yearOfRelease?: number,
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

    const result: Movie = await response.json();
    return result;
};

export const omdbGetMovieByTitle = async ({
         apiKey,
         text,
         type,
         yearOfRelease,
         returnType,
         plot,
         version
        }: PluginOptions) => {
            const results = await getByTitle(apiKey, text, type) as Movie;
            return results;
       };
