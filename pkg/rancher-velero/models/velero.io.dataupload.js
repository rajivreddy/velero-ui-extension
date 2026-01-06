import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroDataUpload extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get sourcePVC() {
    return `${ this.spec?.sourceNamespace }/${ this.spec?.sourcePVC }`;
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation;
  }

  get dataMover() {
    return this.spec?.dataMover;
  }

  get snapshotID() {
    return this.status?.snapshotID;
  }

  get progress() {
    const done = this.status?.progress?.bytesDone || 0;
    const total = this.status?.progress?.totalBytes || 0;

    return total > 0 ? `${ Math.round((done / total) * 100) }%` : '0%';
  }
}
