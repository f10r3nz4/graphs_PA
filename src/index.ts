import { App } from "./app";

//avvio dell'applicazione

const start = (): void => {
    const app = new App();
    app.listen();
}

start();