import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroSchedule extends SteveModel {
  get canUpdate() {
    return true;
  }

  get state() {
    if (this.spec?.paused) {
      return 'Paused';
    }

    return this.status?.phase || 'Unknown';
  }

  get stateColor() {
    if (this.spec?.paused) {
      return 'text-warning';
    }

    const phase = this.status?.phase;

    switch (phase) {
    case 'Enabled':
      return 'text-success';
    case 'FailedValidation':
      return 'text-error';
    default:
      return 'text-muted';
    }
  }

  get stateDisplay() {
    if (this.spec?.paused) {
      return 'Paused';
    }

    return this.status?.phase || 'Unknown';
  }

  get schedule() {
    return this.spec?.schedule || '-';
  }

  get scheduleDescription() {
    const cron = this.spec?.schedule;

    if (!cron) {
      return 'Not set';
    }

    const patterns = {
      '0 * * * *':    'Every hour',
      '0 */6 * * *':  'Every 6 hours',
      '0 */12 * * *': 'Every 12 hours',
      '0 0 * * *':    'Daily at midnight',
      '0 2 * * *':    'Daily at 2 AM',
      '0 0 * * 0':    'Weekly on Sunday at midnight',
      '0 0 1 * *':    'Monthly on the 1st at midnight',
    };

    return patterns[cron] || cron;
  }

  get lastBackup() {
    return this.status?.lastBackup || '-';
  }

  get isPaused() {
    return !!this.spec?.paused;
  }

  get storageLocation() {
    return this.spec?.template?.storageLocation || 'Default';
  }

  get ttl() {
    return this.spec?.template?.ttl || '-';
  }

  get includedNamespaces() {
    return this.spec?.template?.includedNamespaces?.length
      ? this.spec.template.includedNamespaces.join(', ')
      : 'All';
  }

  get _availableActions() {
    const out = super._availableActions;

    // Add pause/resume action
    out.unshift({
      action:  'togglePause',
      enabled: true,
      icon:    this.isPaused ? 'icon icon-fw icon-play' : 'icon icon-fw icon-pause',
      label:   this.isPaused ? 'Resume' : 'Pause',
    });

    // Add "Run Now" action
    out.unshift({
      action:  'runNow',
      enabled: !this.isPaused,
      icon:    'icon icon-fw icon-backup',
      label:   'Run Backup Now',
    });

    return out;
  }

  async togglePause() {
    const isPaused = !this.spec?.paused;

    this.spec = this.spec || {};
    this.spec.paused = isPaused;

    await this.save();
  }

  async runNow() {
    // Create a new backup based on this schedule's template
    const backup = await this.$dispatch('cluster/create', {
      type:     'velero.io.backup',
      metadata: {
        generateName: `${this.metadata?.name}-`,
        namespace:    this.metadata?.namespace,
        labels:       { 'velero.io/schedule-name': this.metadata?.name },
      },
      spec: {
        ...this.spec?.template,
        storageLocation:         this.spec?.template?.storageLocation,
        volumeSnapshotLocations: this.spec?.template?.volumeSnapshotLocations,
      },
    });

    await backup.save();

    this.$dispatch('growl/success', {
      title:   'Backup Created',
      message: `Backup ${backup.metadata?.name} created from schedule ${this.metadata?.name}`,
    }, { root: true });
  }
}
