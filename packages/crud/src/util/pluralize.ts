type Rule = [RegExp, string];
type Rules = Rule[];

interface Options {
  clone?: boolean;
  isMergeableObject: (value: any) => boolean;
  arrayMerge?: (target: any[], source: any[], options: Options) => any[];
  customMerge?: (key: string) => ((target: any, source: any, options: Options) => any) | undefined;
}
var pluralRules = [];
var singularRules = [];
var uncountables = {};
var irregularPlurals = {};
var irregularSingles = {};
type WordRule = Rule;
type WordRules = WordRule[];

interface ReplaceMap {
  [key: string]: string;
}

interface KeepMap {
  [key: string]: boolean;
}

interface Uncountables {
  [key: string]: boolean;
}

function sanitizeRule(rule: string | RegExp): RegExp {
  if (typeof rule === 'string') {
    return new RegExp('^' + rule + '$', 'i');
  }
  return rule;
}

function restoreCase(word: string, token: string): string {
  if (word === token) return token;
  if (word === word.toLowerCase()) return token.toLowerCase();
  if (word === word.toUpperCase()) return token.toUpperCase();
  if (word[0] === word[0].toUpperCase()) {
    return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
  }
  return token.toLowerCase();
}

function interpolate(str: string, args: string[]): string {
  return str.replace(/\$(\d{1,2})/g, (match, index) => args[index] || '');
}

function replace(word: string, rule: Rule): string {
  return word.replace(rule[0], function (match, index) {
    const result = interpolate(rule[1], arguments as unknown as string[]);
    if (match === '') {
      return restoreCase(word[index - 1], result);
    }
    return restoreCase(match, result);
  });
}

function sanitizeWord(token: string, word: string, rules: WordRules, uncountables: Uncountables): string {
  if (!token.length || uncountables[token]) {
    return word;
  }
  for (let len = rules.length - 1; len >= 0; len--) {
    const rule = rules[len];
    if (rule[0].test(word)) {
      return replace(word, rule);
    }
  }
  return word;
}

function replaceWord(
  replaceMap: ReplaceMap,
  keepMap: KeepMap,
  rules: WordRules,
  uncountables: Uncountables,
): (word: string) => string {
  return function (word: string): string {
    const token = word.toLowerCase();
    if (keepMap[token]) {
      return restoreCase(word, token);
    }
    if (replaceMap[token]) {
      return restoreCase(word, replaceMap[token]);
    }
    return sanitizeWord(token, word, rules, uncountables);
  };
}

function checkWord(
  replaceMap: ReplaceMap,
  keepMap: KeepMap,
  rules: WordRules,
  uncountables: Uncountables,
): (word: string) => boolean {
  return function (word: string): boolean {
    const token = word.toLowerCase();
    if (keepMap[token]) return true;
    if (replaceMap[token]) return false;
    return sanitizeWord(token, token, rules, uncountables) === token;
  };
}

function pluralize(word: string, count?: number, inclusive?: boolean): string {
  const pluralized = count === 1 ? pluralize.singular(word) : pluralize.plural(word);

  return (inclusive ? count + ' ' : '') + pluralized;
}

pluralize.plural = replaceWord(irregularSingles, irregularPlurals, pluralRules, uncountables);

pluralize.isPlural = checkWord(irregularSingles, irregularPlurals, pluralRules, uncountables);

pluralize.singular = replaceWord(irregularPlurals, irregularSingles, singularRules, uncountables);

pluralize.isSingular = checkWord(irregularPlurals, irregularSingles, singularRules, uncountables);

function addPluralRule(rule: string | RegExp, replacement: string): void {
  pluralRules.push([sanitizeRule(rule), replacement]);
}

function addSingularRule(rule: string | RegExp, replacement: string): void {
  singularRules.push([sanitizeRule(rule), replacement]);
}

function addUncountableRule(word: string | RegExp): void {
  if (typeof word === 'string') {
    uncountables[word.toLowerCase()] = true;
  } else {
    addPluralRule(word, '$0');
    addSingularRule(word, '$0');
  }
}

function addIrregularRule(single: string, plural: string): void {
  plural = plural.toLowerCase();
  single = single.toLowerCase();
  irregularSingles[single] = plural;
  irregularPlurals[plural] = single;
}

// Irregular rules.
[
  // Pronouns.
  ['I', 'we'],
  ['me', 'us'],
  ['he', 'they'],
  ['she', 'they'],
  ['them', 'them'],
  ['myself', 'ourselves'],
  ['yourself', 'yourselves'],
  ['itself', 'themselves'],
  ['herself', 'themselves'],
  ['himself', 'themselves'],
  ['themself', 'themselves'],
  ['is', 'are'],
  ['was', 'were'],
  ['has', 'have'],
  ['this', 'these'],
  ['that', 'those'],
  ['my', 'our'],
  ['its', 'their'],
  ['his', 'their'],
  ['her', 'their'],
  // Words ending in with a consonant and `o`.
  ['echo', 'echoes'],
  ['dingo', 'dingoes'],
  ['volcano', 'volcanoes'],
  ['tornado', 'tornadoes'],
  ['torpedo', 'torpedoes'],
  // Ends with `us`.
  ['genus', 'genera'],
  ['viscus', 'viscera'],
  // Ends with `ma`.
  ['stigma', 'stigmata'],
  ['stoma', 'stomata'],
  ['dogma', 'dogmata'],
  ['lemma', 'lemmata'],
  ['schema', 'schemata'],
  ['anathema', 'anathemata'],
  // Other irregular rules.
  ['ox', 'oxen'],
  ['axe', 'axes'],
  ['die', 'dice'],
  ['yes', 'yeses'],
  ['foot', 'feet'],
  ['eave', 'eaves'],
  ['goose', 'geese'],
  ['tooth', 'teeth'],
  ['quiz', 'quizzes'],
  ['human', 'humans'],
  ['proof', 'proofs'],
  ['carve', 'carves'],
  ['valve', 'valves'],
  ['looey', 'looies'],
  ['thief', 'thieves'],
  ['groove', 'grooves'],
  ['pickaxe', 'pickaxes'],
  ['passerby', 'passersby'],
  ['canvas', 'canvases'],
].forEach(([single, plural]) => addIrregularRule(single, plural));

// Pluralization rules.
[
  [/s?$/i, 's'],
  [/[^\u0000-\u007F]$/i, '$0'],
  [/([^aeiou]ese)$/i, '$1'],
  [/(ax|test)is$/i, '$1es'],
  [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
  [/(e[mn]u)s?$/i, '$1s'],
  [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
  [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
  [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
  [/(seraph|cherub)(?:im)?$/i, '$1im'],
  [/(he|at|gr)o$/i, '$1oes'],
  [
    /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,
    '$1a',
  ],
  [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
  [/sis$/i, 'ses'],
  [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
  [/([^aeiouy]|qu)y$/i, '$1ies'],
  [/([^ch][ieo][ln])ey$/i, '$1ies'],
  [/(x|ch|ss|sh|zz)$/i, '$1es'],
  [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
  [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
  [/(pe)(?:rson|ople)$/i, '$1ople'],
  [/(child)(?:ren)?$/i, '$1ren'],
  [/eaux$/i, '$0'],
  [/m[ae]n$/i, 'men'],
  ['thou', 'you'],
].forEach((rule) => addPluralRule(rule[0], rule[1] as string));

// Singularization rules.
[
  [/s$/i, ''],
  [/(ss)$/i, '$1'],
  [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
  [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
  [/ies$/i, 'y'],
  [/(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, '$1ie'],
  [
    /\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i,
    '$1ie',
  ],
  [/\b(mon|smil)ies$/i, '$1ey'],
  [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
  [/(seraph|cherub)im$/i, '$1'],
  [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:he|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
  [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
  [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
  [/(test)(?:is|es)$/i, '$1is'],
  [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
  [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
  [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
  [/(alumn|alg|vertebr)ae$/i, '$1a'],
  [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
  [/(matr|append)ices$/i, '$1ix'],
  [/(pe)(rson|ople)$/i, '$1rson'],
  [/(child)ren$/i, '$1'],
  [/(eau)x?$/i, '$1'],
  [/men$/i, 'man'],
].forEach((rule) => addSingularRule(rule[0], rule[1] as string));

// Uncountable rules.
[
  // Singular words with no plurals.
  'adulthood',
  'advice',
  'agenda',
  'aid',
  // ... (other uncountable words)
  /pok[eé]mon$/i,
  // Regexes.
  /[^aeiou]ese$/i, // "chinese", "japanese"
  /deer$/i, // "deer", "reindeer"
  /fish$/i, // "fish", "blowfish", "angelfish"
  /measles$/i,
  /o[iu]s$/i, // "carnivorous"
  /pox$/i, // "chickpox", "smallpox"
  /sheep$/i,
].forEach((word) => addUncountableRule(word));

export default pluralize;
