import { ailment, move, pokemon, PokemonTypes } from "./types";

export function validatePokemon(pokemon: pokemon): pokemon {
  if (typeof pokemon !== "object" || pokemon === null) {
    throw new Error("Invalid Pokémon object: not an object.");
  }

  const { stats, name, type, health, moves, isBoolean } = pokemon;

  // Validate stats
  if (typeof stats !== "object" || stats === null) {
    throw new Error(
      "Invalid Pokémon object: 'stats' is missing or not an object."
    );
  }

  const { hp, attack, defense, speed } = stats;
  if (
    typeof hp !== "number" ||
    typeof attack !== "number" ||
    typeof defense !== "number" ||
    typeof speed !== "number"
  ) {
    throw new Error("Invalid Pokémon object: 'stats' fields must be numbers.");
  }

  // Validate name
  if (typeof name !== "string") {
    throw new Error("Invalid Pokémon object: 'name' must be a string.");
  }

  // Validate type
  if (typeof type !== "string") {
    throw new Error("Invalid Pokémon object: 'type' must be a string.");
  }

  // Validate health
  if (typeof health !== "number") {
    throw new Error("Invalid Pokémon object: 'health' must be a number.");
  }

  // Validate moves
  if (
    !Array.isArray(moves) ||
    !moves.every((move) => typeof move === "string")
  ) {
    throw new Error(
      "Invalid Pokémon object: 'moves' must be an array of strings."
    );
  }

  // Validate isBoolean
  if (typeof isBoolean !== "boolean") {
    throw new Error("Invalid Pokémon object: 'isBoolean' must be a boolean.");
  }

  return pokemon as pokemon;
}
function getTypeEffectiveness(
  moveType: PokemonTypes,
  targetTypes: PokemonTypes[]
): number {
  if (!Array.isArray(targetTypes)) {
    targetTypes = [targetTypes]; // Ensure targetTypes is an array
  }

  let effectiveness = 1.0;

  targetTypes.forEach((targetType) => {
    if (
      moveType in typeAdvantageMatrix &&
      targetType in typeAdvantageMatrix[moveType]
    ) {
      effectiveness *= typeAdvantageMatrix[moveType][targetType]!;
    }
  });

  return effectiveness;
}
function doesMoveHit(
  moveAccuracy: number,
  attackerSpeed: number,
  defenderSpeed: number
) {
  // Derive target evasion based on defender's speed relative to attacker's speed
  const targetEvasion = defenderSpeed / attackerSpeed;

  // Calculate hit chance
  const hitChance = moveAccuracy * (100 / (100 + targetEvasion * 50)); // Arbitrary factor to scale evasion

  // Generate a random number to determine if the move hits
  const random = Math.random() * 100;
  return random <= hitChance;
}
function isCriticalHit() {
  return Math.random() < 0.0625; // 6.25% chance for critical hit
}

function applyAilmentEffect(ailment: ailment) {
  switch (ailment) {
    case "paralysis":
      // Paralysis: 25% chance to fail the move
      return Math.random() >= 0.25; // 75% chance to succeed

    case "sleep":
      // Sleep: The attacker can't move while asleep
      // For one move: Assume the move fails if the Pokémon is asleep
      return false; // Move always fails if the attacker is asleep

    case "freeze":
      // Freeze: The attacker is frozen and can't move
      // For one move: Assume the move fails if the Pokémon is frozen
      return false; // Move fails if the attacker is frozen

    case "burn":
      // Burn: Typically reduces the power of physical moves and deals damage over time
      // For one move: Assume burn does not affect the move's ability to execute
      return true; // Burn does not affect move success directly

    case "poison":
      // Poison: Deals damage over time but does not directly affect move success
      // For one move: Assume poison does not affect the move's ability to execute
      return true; // Poison does not affect move success directly

    case "confusion":
      // Confusion: 50% chance that the move will fail due to confusion
      return Math.random() >= 0.5; // 50% chance to succeed

    case "trap":
      // Trap: The Pokémon is trapped and can't switch out
      // For one move: Assume trap does not affect the move's ability to execute
      return true; // Trap does not affect move success directly

    default:
      // No status effect or unrecognized status
      return true;
  }
}
const typeAdvantageMatrix: {
  [key in PokemonTypes]: {
    [key in PokemonTypes]?: number;
  };
} = {
  Bug: {
    Bug: 1,
    Dark: 2,
    Electric: 1,
    Dragon: 1,
    Fire: 0.5,
    Grass: 0.5,
    Fairy: 0.5,
    Fighting: 0.5,
    Flying: 0.5,
    Ghost: 0.5,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 1,
    Steel: 0.5,
    Water: 1,
  },
  Dark: {
    Bug: 2,
    Dark: 0.5,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 1,
    Fairy: 0.5,
    Fighting: 0.5,
    Flying: 1,
    Ghost: 2,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 2,
    Ground: 1,
    Steel: 1,
    Water: 1,
  },
  Electric: {
    Bug: 1,
    Dark: 1,
    Electric: 0.5,
    Dragon: 1,
    Fire: 1,
    Grass: 0.5,
    Fairy: 1,
    Fighting: 1,
    Flying: 2,
    Ghost: 1,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 0,
    Steel: 1,
    Water: 2,
  },
  Dragon: {
    Bug: 1,
    Dark: 1,
    Electric: 1,
    Dragon: 2,
    Fire: 0.5,
    Grass: 0.5,
    Fairy: 0,
    Fighting: 1,
    Flying: 1,
    Ghost: 1,
    Rock: 1,
    Ice: 2,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 1,
    Steel: 0.5,
    Water: 0.5,
  },
  Fire: {
    Bug: 2,
    Dark: 1,
    Electric: 1,
    Dragon: 0.5,
    Fire: 0.5,
    Grass: 2,
    Fairy: 1,
    Fighting: 1,
    Flying: 1,
    Ghost: 1,
    Rock: 0.5,
    Ice: 2,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 1,
    Steel: 0.5,
    Water: 0.5,
  },
  Grass: {
    Bug: 0.5,
    Dark: 1,
    Electric: 1,
    Dragon: 0.5,
    Fire: 2,
    Grass: 0.5,
    Fairy: 1,
    Fighting: 1,
    Flying: 0.5,
    Ghost: 1,
    Rock: 2,
    Ice: 1,
    Normal: 1,
    Poison: 0.5,
    Psychic: 1,
    Ground: 2,
    Steel: 0.5,
    Water: 0.5,
  },
  Fairy: {
    Bug: 1,
    Dark: 2,
    Electric: 1,
    Dragon: 0,
    Fire: 1,
    Grass: 1,
    Fairy: 1,
    Fighting: 0.5,
    Flying: 1,
    Ghost: 1,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 2,
    Psychic: 1,
    Ground: 1,
    Steel: 0.5,
    Water: 1,
  },
  Fighting: {
    Bug: 0.5,
    Dark: 0.5,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 1,
    Fairy: 2,
    Fighting: 1,
    Flying: 0.5,
    Ghost: 0,
    Rock: 2,
    Ice: 2,
    Normal: 2,
    Poison: 0.5,
    Psychic: 0.5,
    Ground: 1,
    Steel: 2,
    Water: 1,
  },
  Flying: {
    Bug: 2,
    Dark: 1,
    Electric: 0.5,
    Dragon: 1,
    Fire: 1,
    Grass: 2,
    Fairy: 1,
    Fighting: 2,
    Flying: 1,
    Ghost: 1,
    Rock: 0.5,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 0,
    Steel: 0.5,
    Water: 1,
  },
  Ghost: {
    Bug: 0.5,
    Dark: 2,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 1,
    Fairy: 1,
    Fighting: 0,
    Flying: 1,
    Ghost: 2,
    Rock: 1,
    Ice: 1,
    Normal: 0,
    Poison: 0.5,
    Psychic: 1,
    Ground: 1,
    Steel: 1,
    Water: 1,
  },
  Rock: {
    Bug: 1,
    Dark: 1,
    Electric: 1,
    Dragon: 1,
    Fire: 2,
    Grass: 0.5,
    Fairy: 1,
    Fighting: 0.5,
    Flying: 2,
    Ghost: 1,
    Rock: 1,
    Ice: 2,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 2,
    Steel: 0.5,
    Water: 1,
  },
  Ice: {
    Bug: 1,
    Dark: 1,
    Electric: 1,
    Dragon: 2,
    Fire: 0.5,
    Grass: 2,
    Fairy: 1,
    Fighting: 1,
    Flying: 1,
    Ghost: 1,
    Rock: 0.5,
    Ice: 0.5,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 2,
    Steel: 0.5,
    Water: 0.5,
  },
  Normal: {
    Bug: 1,
    Dark: 1,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 1,
    Fairy: 2,
    Fighting: 2,
    Flying: 1,
    Ghost: 0,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 1,
    Steel: 0.5,
    Water: 1,
  },
  Poison: {
    Bug: 1,
    Dark: 1,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 0.5,
    Fairy: 0.5,
    Fighting: 0.5,
    Flying: 1,
    Ghost: 1,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 0.5,
    Psychic: 2,
    Ground: 2,
    Steel: 0.5,
    Water: 1,
  },
  Psychic: {
    Bug: 1,
    Dark: 0.5,
    Electric: 1,
    Dragon: 1,
    Fire: 1,
    Grass: 1,
    Fairy: 1,
    Fighting: 2,
    Flying: 1,
    Ghost: 1,
    Rock: 1,
    Ice: 1,
    Normal: 1,
    Poison: 2,
    Psychic: 0.5,
    Ground: 1,
    Steel: 0.5,
    Water: 1,
  },
  Ground: {
    Bug: 1,
    Dark: 1,
    Electric: 2,
    Dragon: 1,
    Fire: 1,
    Grass: 2,
    Fairy: 1,
    Fighting: 1,
    Flying: 0,
    Ghost: 1,
    Rock: 2,
    Ice: 2,
    Normal: 1,
    Poison: 0.5,
    Psychic: 1,
    Ground: 1,
    Steel: 2,
    Water: 1,
  },
  Steel: {
    Bug: 0.5,
    Dark: 1,
    Electric: 0.5,
    Dragon: 0.5,
    Fire: 2,
    Grass: 0.5,
    Fairy: 0.5,
    Fighting: 2,
    Flying: 0.5,
    Ghost: 1,
    Rock: 2,
    Ice: 2,
    Normal: 1,
    Poison: 0,
    Psychic: 0.5,
    Ground: 2,
    Steel: 0.5,
    Water: 0.5,
  },
  Water: {
    Bug: 1,
    Dark: 1,
    Electric: 2,
    Dragon: 0.5,
    Fire: 2,
    Grass: 0.5,
    Fairy: 1,
    Fighting: 1,
    Flying: 1,
    Ghost: 1,
    Rock: 2,
    Ice: 1,
    Normal: 1,
    Poison: 1,
    Psychic: 1,
    Ground: 2,
    Steel: 0.5,
    Water: 0.5,
  },
};
export function calculateDamage(
  attacker: pokemon,
  defender: pokemon,
  move: move
) {
  // Base power of the move
  let basePower = move.power;
  let message = "";
  let ailmentOfDefendingPokemon = null; // reset the ailment of the defending pokemon

  // STAB (Same Type Attack Bonus)
  if (attacker.type.includes(move.type)) {
    basePower *= 1.5;
  }

  // Type effectiveness
  const typeEffectiveness = getTypeEffectiveness(move.type, [defender.type]);

  // Check if the move hits
  if (!doesMoveHit(move.accuracy, attacker.stats.speed, defender.stats.speed)) {
    return {
      damage: 0,
      message: `${attacker.name} used ${move.name}, but it missed!`,
      ailmentOfDefendingPokemon,
    };
  }

  // Apply status effects to the attacker
  if (!applyAilmentEffect(attacker.ailment)) {
    return {
      damage: 0,
      message: `${attacker.name} used ${move.name}, but it failed due to ${attacker.ailment}!`,
      ailmentOfDefendingPokemon,
    };
  }

  // Critical hit
  const critical = isCriticalHit() ? 1.5 : 1.0;
  if (critical > 1.0) {
    message += "A critical hit! ";
  }

  // Random factor (85% to 100%)
  const randomFactor = 0.85 + Math.random() * 0.15;

  // Basic damage calculation
  const damage =
    ((basePower * (attacker.stats.attack / defender.stats.defense)) / 50 + 2) *
    typeEffectiveness *
    critical *
    randomFactor;

  // Determine effectiveness message
  if (typeEffectiveness > 1.0) {
    message += `${attacker.name} used ${move.name}! ` + "It's super effective!";
  } else if (typeEffectiveness < 1.0 && typeEffectiveness > 0) {
    message +=
      `${attacker.name} used ${move.name}! ` + "It's not very effective...";
  } else if (typeEffectiveness === 0) {
    message += `${attacker.name} used ${move.name}! ` + "It had no effect...";
  }

  // Check if the move has a status ailment and if it applies
  if (move.ailment && Math.random() * 100 <= move.ailmentChance) {
    console.log("Ailment applied");
    ailmentOfDefendingPokemon = move.ailment;
    message += ` ${defender.name} is now ${move.ailment}!`;
  }

  return {
    damage: Math.round(damage),
    message: message || `${attacker.name} used ${move.name}!`,
    ailmentOfDefendingPokemon,
  };
}
