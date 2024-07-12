const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            // Remove unsupported options:
            // keepAlive: true,
            //poolSize: 50,
            autoIndex: false,
            retryWrites: false
        },
        url: 'mongodb+srv://Ujjwal:Ujjwal24@learn.gtduffm.mongodb.net/Learn'
    },
    server: {
        host: 'localhost',
        port: 1337
    }
};

export default config;
