import SteveModel from '@shell/plugins/steve/steve-class';

export default class DeleteBackupRequest extends SteveModel {
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
    case 'Processed':
      return 'bg-success';
    case 'InProgress':
      return 'bg-info';
    case 'Failed':
      return 'bg-error';
    case 'New':
      return 'bg-warning';
    default:
      return 'bg-info';
    }
  }

  get backupName() {
    return this.spec?.backupName || '-';
  }

  get errors() {
    return this.status?.errors || [];
  }
}
