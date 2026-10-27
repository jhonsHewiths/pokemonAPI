const BASE_URL = 'https://pokeapi.co/api/v2';

const mapPokemonListItem = (item) => {
    const idMatch = item.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? idMatch[1] : null;

    return {
        id,
        name: item.name,
        thumbnail: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
};

// Mapea las stats del pokemon
const mapPokemonDetail = (row) => {
    return {
        id: row.id,
        name: row.name,
        height: row.height / 10,
        weight: row.weight / 10,
        types: row.types.map((t) => t.type.name),
        stats: row.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
        })),
        thumbnail: row.sprites.other?.['official-artwork']?.front_default || row.sprites.front_default,
    };
};

// Obtiene la lista de los pokemon
export const getPokemonList = async (limit = 20, offset = 0, signal) => {
    const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Error http: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map(mapPokemonListItem);
};

export const getPokemonDetail = async (queryOrId, signal) => {
    try {
        const query = String(queryOrId).toLowerCase().trim();
        const url = `${BASE_URL}/pokemon/${encodeURIComponent(query)}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return mapPokemonDetail(data);
    } catch (error) {
        console.error("Error en getPokemonDetail:", error);
        return null;
    }
};

export const getPokemonByIdOrName = async (queryOrId, signal) => {
    return getPokemonDetail(queryOrId, signal);
};