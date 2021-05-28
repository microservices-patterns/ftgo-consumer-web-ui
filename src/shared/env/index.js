import { getEnvVar } from './envGetter';

/**
 * @description this will be replaced by ensureEnvVariablesWithParameterStore()
 * @param envVars
 * @param fallbackValues
 * @returns {String[]}
 */
export function ensureEnvVariables(envVars, fallbackValues) {
  const hitsAndMisses = Array.from(envVars).map((envVar, idx) => ({
    env: envVar,
    val: getEnvVar(envVar),
    fallback: fallbackValues && fallbackValues[ idx ]
  }));

  const misses = hitsAndMisses.filter(({ val, fallback }) => !val && (typeof fallback === 'undefined')).map(({ env }) => env);

  if (misses.length) {
    throw new Error(`Set up these environment variables: ${ misses.join(', ') }`);
  }

  return hitsAndMisses.map(({ val, fallback }) => (val || fallback));
}


export function ensureEnvVariable(envVar, fallback) {
  const [ result ] = ensureEnvVariables([ envVar ], [ fallback ]);
  return result;
}
