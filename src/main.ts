import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js';

bootstrapApplication(App, appConfig).catch((err) => {
  console.error(err);
  document.body.innerHTML = `<pre style="padding:16px;white-space:pre-wrap;">${String(err?.stack ?? err)}</pre>`;
});
