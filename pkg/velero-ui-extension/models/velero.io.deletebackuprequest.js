import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroDeleteBackupRequest extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get backupName() {
    return this.spec?.backupName;
  }

  get errors() {
    return this.status?.errors?.join(', ') || 'None';
  }
}
