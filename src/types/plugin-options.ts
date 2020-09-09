export interface PluginOptions {
    // Auth
    apiKey: string;

    // Config
    text: string;
    type?: 'movie' | 'series' | 'episode';
    yearOfRelease?: number;
    returnType?: string;
    plot?: string;
    version?: number;
}