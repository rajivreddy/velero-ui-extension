import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackup extends SteveModel {
  get canUpdate() {
    return true;
  }

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
    case 'Deleting':
      return 'text-warning';
    default:
      return 'text-muted';
    }
  }

  get stateDisplay() {
    return this.status?.phase || 'Unknown';
  }

  get storageLocation() {
    return this.spec?.storageLocation || 'Default';
  }

  get ttl() {
    return this.spec?.ttl || '-';
  }

  get includedNamespaces() {
    return this.spec?.includedNamespaces?.length
      ? this.spec.includedNamespaces.join(', ')
      : 'All';
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

  get expiration() {
    return this.status?.expiration || '-';
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

  get _availableActions() {
    const out = super._availableActions;

    // Add "Create Restore" action
    out.unshift({
      action:  'createRestore',
      enabled: this.status?.phase === 'Completed' || this.status?.phase === 'PartiallyFailed',
      icon:    'icon icon-fw icon-backup-restore',
      label:   'Create Restore',
    });

    return out;
  }

  createRestore() {
    const router = this.$rootState.$router;
    const namespace = this.metadata?.namespace || 'velero';

    router.push({
      name:   'c-cluster-product-resource-create',
      params: { resource: 'velero.io.restore' },
      query:  {
        backupName: this.metadata?.name,
        namespace,
      },
    });
  }
}
