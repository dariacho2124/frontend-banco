import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

try {
  await platformBrowser().bootstrapModule(AppModule, {});
} catch (err) {
  console.error(err);
}
