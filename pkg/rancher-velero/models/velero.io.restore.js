import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroRestore extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get backupName() {
    return this.spec?.backupName;
  }

  get startTimestamp() {
    return this.status?.startTimestamp;
  }

  get completionTimestamp() {
    return this.status?.completionTimestamp;
  }

  get warnings() {
    return this.status?.warnings || 0;
  }

  get errors() {
    return this.status?.errors || 0;
  }

  get includedNamespaces() {
    return this.spec?.includedNamespaces?.join(', ') || 'All';
  }
}
