import createNodeHelpers from 'gatsby-node-helpers';

const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'Omdb',
});

export const OmdbNode = createNodeFactory('OMDB');
