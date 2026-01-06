import SteveModel from '@shell/plugins/steve/steve-class';

export default class PodVolumeBackup extends SteveModel {
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
      return 'bg-warning';
    default:
      return 'bg-info';
    }
  }

  get backupName() {
    return this.spec?.backupStorageLocation || this.metadata?.labels?.['velero.io/backup-name'] || '-';
  }

  get podName() {
    return this.spec?.pod?.name || '-';
  }

  get podNamespace() {
    return this.spec?.pod?.namespace || '-';
  }

  get volume() {
    return this.spec?.volume || '-';
  }

  get uploaderType() {
    return this.spec?.uploaderType || 'restic';
  }

  get snapshotID() {
    return this.status?.snapshotID || '-';
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
}
