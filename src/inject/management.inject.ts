import { Inject } from "@nestjs/common";
import { AUTH0_MANAGEMENT_CLIENT } from "../constants";

/**
 * Inject management client.
 *
 * @returns
 */
export function InjectManagement() {
    return Inject(AUTH0_MANAGEMENT_CLIENT);
}
