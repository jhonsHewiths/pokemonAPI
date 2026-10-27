import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

export default function PokemonCard({ pokemon, onPress }) {

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  const capitalizedName = pokemon.name ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: pokemon.thumbnail }} style={styles.image} />
      
      <View style={styles.info}>
        <Text style={styles.idText}>{formattedId}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {capitalizedName}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: spacing.xs,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '48%',
  },
  pressed: {
    opacity: 0.6,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  info: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  idText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
}); 