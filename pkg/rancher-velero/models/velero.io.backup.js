import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackup extends SteveModel {
  get _availableActions() {
    const out = super._availableActions;

    // Add custom actions for Backup
    out.unshift({
      action:  'createRestore',
      enabled: this.status?.phase === 'Completed',
      icon:    'icon icon-fw icon-backup-restore',
      label:   'Create Restore',
    });

    return out;
  }

  createRestore() {
    const cluster = this.$rootGetters['clusterId'];

    this.$router.push({
      name:   'c-cluster-velero-resource-create',
      params: {
        cluster,
        resource: 'velero.io.restore',
      },
      query: { backupName: this.metadata?.name },
    });
  }

  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get startTimestamp() {
    return this.status?.startTimestamp;
  }

  get completionTimestamp() {
    return this.status?.completionTimestamp;
  }

  get storageLocation() {
    return this.spec?.storageLocation;
  }

  get includedNamespaces() {
    return this.spec?.includedNamespaces?.join(', ') || 'All';
  }

  get excludedNamespaces() {
    return this.spec?.excludedNamespaces?.join(', ') || 'None';
  }
}
