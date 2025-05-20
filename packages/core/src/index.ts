import { getIntegrationClass, registerProvider as rp } from './registry';

export interface ProviderMap {}
export interface IntegrationBehaviorMap {}

export type Provider = keyof ProviderMap;
export type ProviderOptions<P extends Provider> = ProviderMap[P];

export interface IntegrationClass<P extends Provider> {
  new (provider: P, options: ProviderOptions<P>): Integration<P>;
}

export type OAuth2Credentials = {
  accessToken: string;
  refreshToken?: string;
}

export abstract class Integration<P extends Provider> {
  constructor(public provider: P, public options: ProviderOptions<P>) {}
  abstract getAuthUrl(): string;
  abstract authenticate(code: string): Promise<OAuth2Credentials>;
}

export type AugmentedIntegration<P extends Provider> =
  Integration<P> & IntegrationBehaviorMap[P];

export const registerProvider = rp;

export const createIntegration = <P extends Provider>(
  provider: P,
  options: ProviderOptions<P>
): AugmentedIntegration<P> => {
  const IntegrationCtor = getIntegrationClass(provider);
  return new IntegrationCtor(provider, options) as AugmentedIntegration<P>;
};