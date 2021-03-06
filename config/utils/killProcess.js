const ALLOWED_SIGNALS = ['SIGTERM', 'SIGINT', 'SIGQUIT'];

export default (process, { signal = 'SIGTERM', timeout = 4000 } = {}) => {
    if (!ALLOWED_SIGNALS.includes(signal)) {
        throw new Error(`Invalid signal: "${signal}", expecting one of ${ALLOWED_SIGNALS.join()}`);
    }

    return new Promise((resolve) => {
        const killTimeout = setTimeout(() => {
            // eslint-disable-next-line no-console
            console.warn('[Vitamin] Server timeout: sending SIGKILL...');
            process.kill('SIGKILL');
        }, timeout);

        process.removeAllListeners();
        process.addListener('exit', () => {
            clearTimeout(killTimeout);
            resolve();
        });
        process.kill(signal);
    });
};
