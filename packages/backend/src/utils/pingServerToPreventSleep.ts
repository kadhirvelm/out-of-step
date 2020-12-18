const INTERVAL = 1000 * 60 * 25;

export function pingServerToPreventSleep() {
    setTimeout(() => {
        try {
            fetch(`${process.env.HOSTNAME}/`);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Something went wrong trying to ping the server.", e);
        } finally {
            pingServerToPreventSleep();
        }
    }, INTERVAL);
}
