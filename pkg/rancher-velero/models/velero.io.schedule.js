import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroSchedule extends SteveModel {
  get _availableActions() {
    const out = super._availableActions;

    out.unshift({
      action:  'runBackupNow',
      enabled: this.status?.phase !== 'FailedValidation',
      icon:    'icon icon-fw icon-play',
      label:   'Run Backup Now',
    });

    return out;
  }

  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get schedule() {
    return this.spec?.schedule;
  }

  get lastBackup() {
    return this.status?.lastBackup;
  }

  get paused() {
    return this.spec?.paused || false;
  }

  get templateTTL() {
    return this.spec?.template?.ttl;
  }
}
