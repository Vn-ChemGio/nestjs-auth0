import { Global, Module, DynamicModule, Provider } from "@nestjs/common";
import { getManagementClient } from "../clients/management.client";
import { ManagementAsyncOptions, ManagementClientOptions, ManagementOptionsFactory } from '../auth0.options';
import { createManagementProvider } from "../providers/management.provider";
import { AUTH0_MANAGEMENT_CLIENT, AUTH0_MANAGEMENT_MODULE } from "../constants";

@Global()
@Module({})
export class ManagementCoreModule {
    /**
     * For root.
     *
     * @param {ManagementClientOptions} options
     *
     * @return {DynamicModule}
     */
    public static forRoot(options: ManagementClientOptions): DynamicModule {
        const provider = createManagementProvider(options);

        return {
            exports: [provider],
            module: ManagementCoreModule,
            providers: [provider],
        }
    }

    /**
     * For root async.
     *
     * @param {ManagementAsyncOptions} options
     *
     * @return {DynamicModule}
     */
    static forRootAsync(options: ManagementAsyncOptions): DynamicModule {
        const provider: Provider<any> = {
            inject: [AUTH0_MANAGEMENT_MODULE],
            provide: AUTH0_MANAGEMENT_CLIENT,
            useFactory: (authOptions: ManagementClientOptions) => getManagementClient(authOptions),
        }

        return {
            exports: [provider],
            imports: options.imports,
            module: ManagementCoreModule,
            providers: [...this.createAsyncProviders(options), provider],
        }
    }

    /**
     * Create async options provider.
     *
     * @param {ManagementAsyncOptions} options
     *
     * @return {Provider}
     */
    private static createAsyncOptionsProvider(options: ManagementAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                inject: options.inject ?? [],
                provide: AUTH0_MANAGEMENT_MODULE,
                useFactory: options.useFactory,
            };
        }

        return {
            inject: options.useExisting
                ? [options.useExisting]
                : options.useClass
                    ? [options.useClass]
                    : [],
            provide: AUTH0_MANAGEMENT_MODULE,
            useFactory: (optionsFactory: ManagementOptionsFactory) => optionsFactory.createAuth0Options(),
        }
    }

    /**
     * Create async provider.
     *
     * @param {ManagementAsyncOptions} options
     *
     * @return {Provider[]}
     */
    private static createAsyncProviders(options: ManagementAsyncOptions): Provider[] {
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
