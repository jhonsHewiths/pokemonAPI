import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { getPokemonDetail } from '../services/pokeAPI';
import { colors, spacing } from '../theme/colors';

export default function DetailScreen({ route, navigation }) {
  const { pokemonId } = route.params;

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Carga detalle de pokemon

  useEffect(() => {
    const controller = new AbortController();

    const Detail = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getPokemonDetail(pokemonId, controller.signal);
        if (data) {
          setPokemon(data);
        } else {
          setError(true);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    Detail();
    return () => controller.abort();
  }, [pokemonId]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />;
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.empty}>No se pudo cargar la ficha del Pokemon.</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver a la lista</Text>
        </Pressable>
      </View>
    );
  }

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: pokemon.thumbnail }} style={styles.image} />
        <Text style={styles.idText}>{formattedId}</Text>
        <Text style={styles.title}>{capitalizedName}</Text>

        <View style={styles.typesRow}>
          {pokemon.types.map((type, index) => {
            const badgeColor = colors.types?.[type] || colors.primary;
            return (
              <View key={index} style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                <Text style={styles.typeText}>{type.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{pokemon.height} m</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{pokemon.weight} kg</Text>
          </View>
        </View>

        <Text style={styles.section}>Estadísticas Base</Text>
        {pokemon.stats.map((stat, index) => {
          const percentage = Math.min((stat.value / 255) * 100, 100);
          return (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statName}>{stat.name.toUpperCase()}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View style={styles.statBarBackground}>
                <View style={[styles.statBarFill, { width: `${percentage}%` }]} />
              </View>
            </View>
          );
        })}

        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver a la lista</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  idText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  typesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statName: {
    width: 110,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  statValue: {
    width: 30,
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textMuted,
    fontSize: 16,
  },
});