import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroRestore extends SteveModel {
  get state() {
    return this.status?.phase || 'Unknown';
  }

  get stateColor() {
    const phase = this.status?.phase;

    switch (phase) {
    case 'Completed':
      return 'text-success';
    case 'Failed':
    case 'PartiallyFailed':
      return 'text-error';
    case 'InProgress':
    case 'New':
    case 'WaitingForPluginOperations':
    case 'WaitingForPluginOperationsPartiallyFailed':
      return 'text-info';
    default:
      return 'text-muted';
    }
  }

  get stateDisplay() {
    return this.status?.phase || 'Unknown';
  }

  get backupName() {
    return this.spec?.backupName || '-';
  }

  get scheduleName() {
    return this.spec?.scheduleName || '-';
  }

  get includedNamespaces() {
    return this.spec?.includedNamespaces?.length
      ? this.spec.includedNamespaces.join(', ')
      : 'All from backup';
  }

  get excludedNamespaces() {
    return this.spec?.excludedNamespaces?.length
      ? this.spec.excludedNamespaces.join(', ')
      : 'None';
  }

  get startTimestamp() {
    return this.status?.startTimestamp || '-';
  }

  get completionTimestamp() {
    return this.status?.completionTimestamp || '-';
  }

  get warnings() {
    return this.status?.warnings || 0;
  }

  get errors() {
    return this.status?.errors || 0;
  }

  get duration() {
    if (this.status?.startTimestamp && this.status?.completionTimestamp) {
      const start = new Date(this.status.startTimestamp);
      const end = new Date(this.status.completionTimestamp);
      const diff = Math.round((end - start) / 1000);

      if (diff < 60) {
        return `${diff}s`;
      }
      if (diff < 3600) {
        return `${Math.floor(diff / 60)}m ${diff % 60}s`;
      }

      return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
    }

    return '-';
  }

  get namespaceMapping() {
    if (this.spec?.namespaceMapping) {
      return Object.entries(this.spec.namespaceMapping)
        .map(([source, target]) => `${source}→${target}`)
        .join(', ');
    }

    return '-';
  }

  get existingResourcePolicy() {
    return this.spec?.existingResourcePolicy || 'none';
  }
}
