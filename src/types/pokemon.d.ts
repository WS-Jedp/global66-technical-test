export interface Pokemon {
  abilities: Ability[];
  base_experience: number;
  cries: Cries;
  forms: NamedAPIResource[];
  game_indices: GameIndex[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  past_abilities: PastAbilities[];
  past_types: any[]; // This appears to be empty in the example, but could contain type changes
  species: NamedAPIResource;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

// Supporting interfaces for nested structures
interface NamedAPIResource {
  name: string;
  url: string;
}

interface Ability {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

interface Cries {
  latest: string;
  legacy: string;
}

interface GameIndex {
  game_index: number;
  version: NamedAPIResource;
}

interface VersionDetail {
  rarity: number;
  version: NamedAPIResource;
}

interface HeldItem {
  item: NamedAPIResource;
  version_details: VersionDetail[];
}

interface MoveLearnMethod {
  name: string;
  url: string;
}

interface VersionGroup {
  name: string;
  url: string;
}

interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  order: number | null;
  version_group: VersionGroup;
}

interface Move {
  move: NamedAPIResource;
  version_group_details: VersionGroupDetail[];
}

interface PastAbility {
  ability: NamedAPIResource | null;
  is_hidden: boolean;
  slot: number;
}

interface Generation {
  name: string;
  url: string;
}

interface PastAbilities {
  abilities: PastAbility[];
  generation: Generation;
}

interface Sprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string | null;
      front_female: string | null;
    };
    home: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown: {
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
  };
  versions: {
    [generation: string]: {
      [version: string]: {
        animated?: {
          back_default?: string | null;
          back_female?: string | null;
          back_shiny?: string | null;
          back_shiny_female?: string | null;
          front_default?: string | null;
          front_female?: string | null;
          front_shiny?: string | null;
          front_shiny_female?: string | null;
        };
        back_default?: string | null;
        back_female?: string | null;
        back_shiny?: string | null;
        back_shiny_female?: string | null;
        back_gray?: string | null;
        back_transparent?: string | null;
        back_shiny_transparent?: string | null;
        front_default?: string | null;
        front_female?: string | null;
        front_shiny?: string | null;
        front_shiny_female?: string | null;
        front_gray?: string | null;
        front_transparent?: string | null;
        front_shiny_transparent?: string | null;
      };
    };
  };
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

interface Type {
  slot: number;
  type: NamedAPIResource;
}