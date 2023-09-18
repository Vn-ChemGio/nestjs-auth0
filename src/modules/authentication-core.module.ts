import { Global, Module, DynamicModule, Provider } from "@nestjs/common";
import { AuthenticationClientOptions } from "auth0";
import { getAuthenticationClient } from "../clients/authentication.client";
import { AUTH0_CLIENT, AUTH0_AUTHENTICATION_MODULE } from "../constants";
import { AuthenticationAsyncOptions, AuthenticationOptionsFactory } from "../auth0.options";
import { createAuthenticationProvider } from "../providers/authentication.provider";

@Global()
@Module({})
export class AuthenticationCoreModule {
    /**
     * For root.
     *
     * @param {AuthenticationClientOptions} options
     *
     * @return {DynamicModule}
     */
    public static forRoot(options: AuthenticationClientOptions): DynamicModule {
        const provider = createAuthenticationProvider(options);

        return {
            exports: [provider],
            module: AuthenticationCoreModule,
            providers: [provider],
        }
    }

    /**
     * For root async.
     *
     * @param {AuthenticationAsyncOptions} options
     *
     * @return {DynamicModule}
     */
    static forRootAsync(options: AuthenticationAsyncOptions): DynamicModule {
        const provider: Provider<any> = {
            inject: [AUTH0_AUTHENTICATION_MODULE],
            provide: AUTH0_CLIENT,
            useFactory: (authOptions: AuthenticationClientOptions) => getAuthenticationClient(authOptions),
        }

        return {
            exports: [provider],
            imports: options.imports,
            module: AuthenticationCoreModule,
            providers: [...this.createAsyncProviders(options), provider],
        }
    }

    /**
     * Create async options provider.
     *
     * @param {AuthenticationAsyncOptions} options
     *
     * @return {Provider}
     */
    private static createAsyncOptionsProvider(options: AuthenticationAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                inject: options.inject ?? [],
                provide: AUTH0_AUTHENTICATION_MODULE,
                useFactory: options.useFactory,
            };
        }

        return {
            inject: options.useExisting
                ? [options.useExisting]
                : options.useClass
                    ? [options.useClass]
                    : [],
            provide: AUTH0_AUTHENTICATION_MODULE,
            useFactory: (optionsFactory: AuthenticationOptionsFactory) => optionsFactory.createAuth0Options(),
        }
    }

    /**
     * Create async provider.
     *
     * @param {AuthenticationAsyncOptions} options
     *
     * @return {Provider[]}
     */
    private static createAsyncProviders(options: AuthenticationAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
                inject: [options.inject ?? []],
            } as any,
        ];
    }
}
