import {Auth, AuthOptions} from "./auth";
import {Client} from "./client";
import {IdentificationRequestOptions} from "./types/IdentificationRequestOption";

export {ServiceAccountOptions} from "./types/ServiceAccountOptions";
export {KeyType} from "./types/KeyType";

export class Bankpass {

    private _client: Client;
    private authModule: Auth;

    constructor(private opts: AuthOptions) {
        this.authModule = new Auth(opts);
    }

    requestUserIdentification = async (opts: IdentificationRequestOptions): Promise<{ orderId: string }> => {
       const client: Client = await this.getClient();
       return client.request('/auth', opts);
    };

    collectResponse = async (orderId: string) => {
        const client: Client = await this.getClient();
        return client.request('/collect', { orderId });
    };

    requestUserSignature = (userId: string) => { throw 'Not implemented yet' };

    private async getClient(): Promise<Client> {
        if(this._client) {
            return this._client;
        }

        this._client = await this.authModule.getClient();
        return this._client
    }

    public async setAccessToken(token: string) {
        if(!this._client) {
            await this.getClient();
        }

        this._client.setAccessToken(token);
    }

}

export { IdentificationRequestOptions };