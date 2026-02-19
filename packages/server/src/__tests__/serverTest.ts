import {IFixture} from "./fixtures/fixture.interface";
import container from "$config/dependencyInjection";
import {setupRoutes} from "$presentation/routes";
import express, {Application} from "express";
import {Container} from "$types/container";
import {env} from "$config/env";
import mongoose from "mongoose";

export class ServerTest {
    private app: Application;
    private container: Container;

    constructor() {
        this.app = express();
        this.container = container;
    }

    async setup() {
        await mongoose.connect(env.MONGO_URI);
        await mongoose.connection.db?.collection("users").deleteMany({});

        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        setupRoutes(this.app);
    }

    async teardown() {
        await mongoose.connection.close(true);
        await mongoose.disconnect();
    }

    async loadFixtures(fixtures: IFixture[]) {
        return Promise.all(fixtures.map(fixture => fixture.load(this.container)));
    }

    get expressApp() {
        return this.app;
    }

    get containerDI() {
        return this.container;
    }
}