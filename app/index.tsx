import { AnyActionArg, useEffect, useState } from "react";
import { Image ,ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import{Link} from "expo-router";
interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types:PokemonType[];

}
interface PokemonType{
  type:{
    name: string;
    url: string;
  }
} 
const colorsByType = {
normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D1D1',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}
export  default function Index() {
  const [pokemons, SetPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=120",
      );

      const data = await response.json();

        const detailedpokimons = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const response = await fetch(pokemon.url);
            const details = await response.json();
            return{
              name: pokemon.name,
              image: details.sprites.front_default,
              imageBack: details.sprites.back_default,
              types: details.types,
          };
    })
        );
            console.log(detailedpokimons);

      SetPokemons(detailedpokimons);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ScrollView
    contentContainerStyle={{
      gap: 16,
      padding: 16,
    }}
    >
      {pokemons.map((pokemon: Pokemon) => (
        <Link key={pokemon.name}
        href=
          {"/details"} 
        style={{
          backgroundColor: colorsByType[pokemon.types[0].type.name as keyof typeof colorsByType] || "white" ,
          padding: 16,
          borderRadius: 50,
        }}
        >
        <View key={pokemon.name} >
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View 
          style={{ flexDirection: "row" }}>

            <Image source={{ uri: pokemon.image }} 
          style={{ width: 150, height: 150 }} />

          <Image source={{ uri: pokemon.imageBack }} 
          style={{ width: 150, height: 150 }} />
          </View>
        
        </View>
        </Link>
      ))}
    </ScrollView>
  );
  
}

const styles =StyleSheet.create({
    name:{
      fontSize: 28,
      fontWeight: "bold",
      fontFamily: "Arial",
      textAlign: "center",
    },
      type:{
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "Arial",
      color: "gray",
      textAlign: "center",
    }
})