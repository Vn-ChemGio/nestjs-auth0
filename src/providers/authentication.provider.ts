import { Provider } from "@nestjs/common";
import { AuthenticationClient, AuthenticationClientOptions } from "auth0";
import { getAuthenticationClient } from "../clients/authentication.client";
import { AUTH0_CLIENT } from "../constants";

/**
 * Create Auth0 authentication provider.
 *
 * @param {AuthenticationClientOptions} options
 *
 * @return
 */
export function createAuthenticationProvider(options: AuthenticationClientOptions): Provider<AuthenticationClient> {
    return {
        provide: AUTH0_CLIENT,
        useValue: getAuthenticationClient(options),
    }
}
