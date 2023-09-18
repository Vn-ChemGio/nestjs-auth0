import { Provider } from "@nestjs/common";
import { ManagementClient } from "auth0";
import { getManagementClient } from "../clients/management.client";
import { AUTH0_MANAGEMENT_CLIENT } from "../constants";
import { ManagementClientOptions } from '../auth0.options';

/**
 * Create Auth0 Management provider.
 *
 * @param {ManagementClientOptions} options
 *
 * @return
 */
export function createManagementProvider(options: ManagementClientOptions): Provider<ManagementClient> {
    return {
        provide: AUTH0_MANAGEMENT_CLIENT,
        useValue: getManagementClient(options),
    }
}
