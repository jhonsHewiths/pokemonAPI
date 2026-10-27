import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getPokemonList, getPokemonByIdOrName } from '../services/pokeAPI';
import PokemonCard from '../components/PokemonCard';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Carga los primeros 20 pokemon 
  
  useEffect(() => { 
    const controller = new AbortController();

    const loadInitialPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await getPokemonList(20, 0, controller.signal);
        setPokemonList(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo conectar con la PokéAPI. Revisa tu internet.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadInitialPokemon();
    return () => controller.abort();
  }, []);

  // Carga restantes

  const LoadMore = async () => {
    if (loadingMore || isSearching || loading) return;

    setLoadingMore(true);
    try {
      const nextOffset = offset + 20;
      const morePokemon = await getPokemonList(20, nextOffset);
      setPokemonList((prev) => [...prev, ...morePokemon]);
      setOffset(nextOffset);
    } catch (err) {
  
    } finally {
      setLoadingMore(false);
    }
  };

  const Search = async () => {
    const query = searchText.trim().toLowerCase();
    
    if (query.length === 0) {
      setIsSearching(false);
      setOffset(0);
      setLoading(true);
      try {
        const results = await getPokemonList(20, 0);
        setPokemonList(results);
      } catch (err) {
        setError('No se pudo recargar la lista.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const result = await getPokemonByIdOrName(query);
      setPokemonList(result ? [result] : []);
    } catch (err) {
      setError('No se pudo realizar la búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o numero:"
          placeholderTextColor={colors.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={Search}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={Search}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.center} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
          <Pressable style={[styles.button, { marginTop: 10 }]} onPress={Search}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => navigation.navigate('Detail', { pokemonId: item.id })}
            />
          )}
          onEndReached={!isSearching ? LoadMore : null}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && <ActivityIndicator size="small" color={colors.primary} style={{ margin: 20 }} />
          }
          ListEmptyComponent={
            <Text style={styles.message}>No se encontraron Pokémon con "{searchText}" 🔍</Text>
          }
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 44,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
});