export = {
    routes: {
        project: "/api/v1/project",
        board: "/api/v1/board",
        state: "/api/v1/state"
    },
    server: {
        conf: {
            port: 8080,
            cors: {
                allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
                credentials: false,
                methods: "GET,HEAD,PUT,POST,DELETE",
                origin: "http://localhost:4200"
            }
        }
    }
}