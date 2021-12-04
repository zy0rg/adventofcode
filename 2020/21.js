const parse = (input) => input
    .split('\n')
    .map((line) => {
        const [ingredients, allergens] = line.split(' (contains ');
        return [
            ingredients.split(' '),
            allergens.substring(0, allergens.length - 1).split(', ')
        ]
    });

export default (input) => {
    const parsed = parse(input);
    const possibleMatches = new Map();

    parsed.forEach(([ingredients, allergens]) =>
        allergens.forEach((allergen) => {
            if (possibleMatches.has(allergen)) {
                const current = possibleMatches.get(allergen);
                possibleMatches.set(allergen, new Set(ingredients.filter((ingredient) => current.has(ingredient))));
            } else {
                possibleMatches.set(allergen, new Set(ingredients));
            }
        }));

    const matches = new Map();
    const matchesArray = Array.from(possibleMatches)

    while (matchesArray.length) {
        const knownIndex = matchesArray.findIndex(([, ingredients]) => ingredients.size === 1);
        const [[allergen, ingredients]] = matchesArray.splice(knownIndex, 1);
        const ingredient = ingredients.values().next().value;
        matchesArray.forEach(([, ingredients]) => ingredients.delete(ingredient));
        matches.set(ingredient, allergen);
    }

    return [
        parsed.reduce((result, [ingredients]) => result + ingredients.filter((ingredient) => !matches.has(ingredient)).length, 0),
        Array.from(matches.entries()).sort(([,a], [,b]) => a.localeCompare(b)).map(([ingredient]) => ingredient).join(',')
    ];
}
