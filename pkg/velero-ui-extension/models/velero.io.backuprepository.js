import SteveModel from '@shell/plugins/steve/steve-class';

export default class BackupRepository extends SteveModel {
  get _availableActions() {
    const out = super._availableActions;

    return out;
  }

  get stateDisplay() {
    const phase = this.status?.phase;

    if (!phase) {
      return 'Unknown';
    }

    return phase;
  }

  get stateBackground() {
    const phase = this.status?.phase;

    switch (phase) {
    case 'Ready':
      return 'bg-success';
    case 'NotReady':
      return 'bg-warning';
    case 'Failed':
      return 'bg-error';
    default:
      return 'bg-info';
    }
  }

  get provider() {
    return this.spec?.volumeNamespace || 'Unknown';
  }

  get repositoryType() {
    return this.spec?.repositoryType || 'Unknown';
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation || '-';
  }

  get resticIdentifier() {
    return this.spec?.resticIdentifier || '-';
  }

  get maintenanceFrequency() {
    return this.spec?.maintenanceFrequency || '-';
  }

  get lastMaintenanceTime() {
    const time = this.status?.lastMaintenanceTime;

    if (!time) {
      return '-';
    }

    return new Date(time).toLocaleString();
  }

  get message() {
    return this.status?.message || '';
  }
}
