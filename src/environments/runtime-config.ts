/**
 * Runtime configuration bridge.
 *
 * Values are injected at container start by `scripts/env.sh`, which runs
 * `envsubst` over `public/assets/env-config.js` and replaces `${VAR}`
 * placeholders with the Kubernetes environment variables of the same name.
 * The resulting object is exposed on `window._env_`.
 *
 * During local development (`npm start`) there is no container and no
 * substitution, so the placeholders survive verbatim. `getRuntimeConfigValue`
 * detects those untouched `${...}` placeholders and falls back to the value
 * baked into the environment files.
 */
interface RuntimeEnv {
  [key: string]: string | undefined;
}

declare global {
  interface Window {
    _env_?: RuntimeEnv;
  }
}

const runtimeEnv: RuntimeEnv =
  typeof window !== 'undefined' && window._env_ ? window._env_ : {};

const isPlaceholder = (value: string | undefined): boolean =>
  typeof value === 'string' && value.startsWith('${') && value.endsWith('}');

const normalizeValue = (value: string | undefined): string | undefined => {
  if (!value || isPlaceholder(value)) {
    return undefined;
  }
  return value;
};

export function getRuntimeConfigValue(key: string, fallback: string): string {
  const candidate = normalizeValue(runtimeEnv[key]);
  return candidate === undefined ? fallback : candidate;
}
