import {
    Auth,
    AuthOptions,
    Client,
    IdentificationRequestOptions,
    Paths,
} from 'bankpass-core';
import { NodeClientFactory } from './node-client';
import { StatelessOrderOptions } from 'bankpass-core';

export { ServiceAccountOptions } from 'bankpass-core';
export { KeyType } from 'bankpass-core';

export { IdentificationRequestOptions };

export class Bankpass {
    private _client: Client;
    private authModule: Auth;

    constructor(private opts: AuthOptions) {
        this.authModule = new Auth(opts, NodeClientFactory);
    }

    requestUserIdentification = async (
        opts: IdentificationRequestOptions
    ): Promise<{ orderId: string }> => {
        const client: Client = await this.getClient();
        return client.request(Paths.AUTH, this.createRequestObject(opts));
    };

    createStatelessOrder = async (
        opts: StatelessOrderOptions
    ): Promise<{ orderId: string }> => {
        const client: Client = await this.getClient();
        return client.request(
            Paths.STATELESS_AUTH,
            this.createRequestObject(opts)
        );
    };

    requestUserSignature = (userId: string) => {
        throw 'Not implemented yet';
    };

    createRequestObject(body: any) {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
    }

    collectResponse = async (orderId: string) => {
        const client: Client = await this.getClient();
        return client.request(
            Paths.COLLECT,
            this.createRequestObject({ orderId })
        );
    };

    getActivationCode = async (userId: string) => {
        const client: Client = await this.getClient();
        return client.request(Paths.CODE, this.createRequestObject({ userId }));
    };

    async getClient(): Promise<Client> {
        if (this._client) {
            return this._client;
        }

        this._client = await this.authModule.getClient();
        return this._client;
    }

    public async setAccessToken(token: string) {
        if (!this._client) {
            await this.getClient();
        }

        this._client.setAccessToken(token);
    }
}
