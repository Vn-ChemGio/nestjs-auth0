import { ManagementClient } from "auth0";
import { ManagementClientOptions } from '../auth0.options';
import { ManagementClientOptionsWithToken } from 'auth0/dist/esm/management/management-client-options';

/**
 * Get Auth0 Authentication client.
 *
 * @param {ManagementClientOptions} options
 *
 * @return {mana}
 */
export function getManagementClient(options: ManagementClientOptions): ManagementClient {
    return new ManagementClient(<ManagementClientOptionsWithToken> options);
}
