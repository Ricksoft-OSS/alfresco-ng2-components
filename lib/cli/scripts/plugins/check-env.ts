import { logger } from './../logger';
import alfrescoApi = require('@alfresco/js-api');

export class CheckEnv {
    _alfrescoJsApi: any;
    TIMEOUT = 6000;
    MAX_RETRY = 10;
    counter = 0;

    constructor(
        private host: string,
        private username: string,
        private password: string
    ) {}

    async checkEnv() {
        try {
            this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility(<any> {
                provider: 'ALL',
                hostBpm: this.host,
                hostEcm: this.host,
                authType: 'OAUTH',
                oauth2: {
                    host: `${this.host}/auth/realms/alfresco`,
                    clientId: 'alfresco',
                    scope: 'openid'
                }
            });
            await this.alfrescoJsApi.login(this.username, this.password);
        } catch (e) {
            if (e.error.code === 'ETIMEDOUT') {
                logger.error('The env is not reachable. Terminating');
                process.exit(1);
            }
            logger.error('Login error environment down or inaccessible');
            this.counter++;
            if (this.MAX_RETRY === this.counter) {
                logger.error('Give up');
                process.exit(1);
            } else {
                logger.error(
                    `Retry in 1 minute at main();tempt N ${this.counter}`
                );
                this.sleep(this.TIMEOUT);
                this.checkEnv();
            }
        }
    }

    public get alfrescoJsApi() {
        return this._alfrescoJsApi;
    }

    public set alfrescoJsApi(alfrescoJsApi: any) {
        this._alfrescoJsApi = alfrescoJsApi;
    }

    sleep(delay) {
        const start = new Date().getTime();
        while (new Date().getTime() < start + delay) {}
    }
}
