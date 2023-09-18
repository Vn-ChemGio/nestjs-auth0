import { Inject } from "@nestjs/common";
import { AUTH0_CLIENT } from "../constants";

/**
 * Inject authentication client.
 *
 * @returns
 */
export function InjectAuthentication() {
    return Inject(AUTH0_CLIENT);
}
