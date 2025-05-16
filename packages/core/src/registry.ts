import { IntegrationClass, Provider } from ".";

const registry: Partial<Record<string, IntegrationClass<Provider>>> = {};

export function registerProvider<P extends Provider>(
  name: P,
  cls: IntegrationClass<P>
) {
  registry[name] = cls;
}

export function getIntegrationClass<P extends Provider>(
  name: P
): IntegrationClass<P> {
  const cls = registry[name];
  if (!cls) throw new Error(`No integration registered for "${name}"`);
  return cls;
}