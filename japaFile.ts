import { HttpServer } from "@adonisjs/core/build/src/Ignitor/HttpServer";
import getPort from "get-port";
import { configure } from "japa";
import { join } from "path";
import "reflect-metadata";
import sourceMapSupport from "source-map-support";

process.env.NODE_ENV = "testing";
process.env.ADONIS_ACE_CWD = join(__dirname);
sourceMapSupport.install({ handleUncaughtExceptions: false });

export let app: HttpServer;



async function startHttpServer() {
  const { Ignitor } = await import("@adonisjs/core/build/src/Ignitor");
  process.env.PORT = String(await getPort());
  app = new Ignitor(__dirname).httpServer();
  await app.start();
}

async function stopHttpServer() {
  await app.close();
}

configure({
  files: ["test/**/*.spec.ts"],
  before: [startHttpServer],
  after: [stopHttpServer],
});
