import serve from 'koa-static';
import mount from 'koa-mount';
import compose from 'koa-compose';
import send from 'koa-send';
import path from 'path';
import config from '../../../config';

const clientEntries = [
    ...Object.keys(config.build.client.secondaryEntries),
    config.build.client.filename,
].map(s => `/${s}`);

function serveClientEntries(entries) {
    return function* serveClientEntriesMiddleware(next) {
        if (entries.includes(this.url)) {
            yield send(this, this.url.slice(1), { root: config.build.path });
        } else {
            yield next;
        }
    };
}

const serveStaticAssets = compose([
    serveClientEntries(clientEntries),
    mount('/files', serve(path.join(config.build.path, 'files'))),
]);

const publicPath = config.build.client.publicPath;
export default () => (publicPath ? mount(publicPath, serveStaticAssets) : serveStaticAssets);
