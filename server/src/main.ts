import { Global, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config, graphql, postgres } from './utils';
import * as fs from 'fs';
import * as path from 'path';
import * as colors from 'colors';

const port = process.env.PORT || 5000;

Promise.all(
  fs.readdirSync(path.join(__dirname, 'modules')).map(async (moduleName) => {
    const featureModule = await import(
      path.join(__dirname, 'modules', moduleName, `${moduleName}.module`)
    );

    return featureModule.default;
  }),
).then(async (modules) => {
  @Global()
  @Module({
    imports: [...modules, config, graphql, postgres],
    providers: [],
    exports: [],
  })
  class Application {}

  colors.enable();

  const app = await NestFactory.create(Application);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  console.log(`Server has been started at localhost:${port}`.yellow);
});
