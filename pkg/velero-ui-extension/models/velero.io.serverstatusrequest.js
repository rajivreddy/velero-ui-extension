import SteveModel from '@shell/plugins/steve/steve-class';

export default class ServerStatusRequest extends SteveModel {
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

  get serverStatus() {
    return this.status?.serverStatus || {};
  }

  get serverVersion() {
    return this.serverStatus.version || '-';
  }

  get plugins() {
    return this.status?.plugins || [];
  }

  get processedTimestamp() {
    const time = this.status?.processedTimestamp;

    if (!time) {
      return '-';
    }

    return new Date(time).toLocaleString();
  }
}
