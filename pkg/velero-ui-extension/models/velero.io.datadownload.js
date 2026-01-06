import SteveModel from '@shell/plugins/steve/steve-class';

export default class DataDownload extends SteveModel {
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
    case 'Completed':
      return 'bg-success';
    case 'InProgress':
      return 'bg-info';
    case 'Failed':
      return 'bg-error';
    case 'New':
    case 'Accepted':
    case 'Prepared':
      return 'bg-warning';
    case 'Canceling':
    case 'Canceled':
      return 'bg-muted';
    default:
      return 'bg-info';
    }
  }

  get snapshotID() {
    return this.spec?.snapshotID || '-';
  }

  get targetNamespace() {
    return this.spec?.targetNamespace || '-';
  }

  get targetVolume() {
    return this.spec?.targetVolume || null;
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation || '-';
  }

  get dataMover() {
    return this.spec?.dataMover || 'velero';
  }

  get operationTimeout() {
    return this.spec?.operationTimeout || '-';
  }

  get progress() {
    const progress = this.status?.progress;

    if (!progress) {
      return null;
    }

    return {
      bytesDone:  progress.bytesDone || 0,
      totalBytes: progress.totalBytes || 0,
    };
  }

  get progressPercentage() {
    if (!this.progress || !this.progress.totalBytes) {
      return 0;
    }

    return Math.round((this.progress.bytesDone / this.progress.totalBytes) * 100);
  }

  get startTimestamp() {
    const time = this.status?.startTimestamp;

    if (!time) {
      return '-';
    }

    return new Date(time).toLocaleString();
  }

  get completionTimestamp() {
    const time = this.status?.completionTimestamp;

    if (!time) {
      return '-';
    }

    return new Date(time).toLocaleString();
  }

  get message() {
    return this.status?.message || '';
  }

  get nodeName() {
    return this.status?.node || '-';
  }
}
