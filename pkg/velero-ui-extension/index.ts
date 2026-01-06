import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Register custom Velero icon
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const veleroIcon = require('./assets/velero-logo.svg');

  plugin.register('icon', 'velero', veleroIcon);

  // Load Velero product
  plugin.addProduct(require('./product'));

  // Add Vue Routes
  plugin.addRoutes(require('./routing/extension-routing').default);
}
