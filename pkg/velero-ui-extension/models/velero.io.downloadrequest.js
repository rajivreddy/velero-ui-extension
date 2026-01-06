import SteveModel from '@shell/plugins/steve/steve-class';

export default class DownloadRequest extends SteveModel {
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

  get target() {
    return this.spec?.target || {};
  }

  get targetKind() {
    return this.target.kind || '-';
  }

  get targetName() {
    return this.target.name || '-';
  }

  get downloadURL() {
    return this.status?.downloadURL || '';
  }

  get expiration() {
    const exp = this.status?.expiration;

    if (!exp) {
      return '-';
    }

    return new Date(exp).toLocaleString();
  }
}
