import { IPlugin } from '@shell/core/types';

export const PRODUCT_NAME = 'velero';

export const VELERO_TYPES = {
  BACKUP:                   'velero.io.backup',
  RESTORE:                  'velero.io.restore',
  SCHEDULE:                 'velero.io.schedule',
  BACKUP_STORAGE_LOCATION:  'velero.io.backupstoragelocation',
  VOLUME_SNAPSHOT_LOCATION: 'velero.io.volumesnapshotlocation',
  POD_VOLUME_BACKUP:        'velero.io.podvolumebackup',
  POD_VOLUME_RESTORE:       'velero.io.podvolumerestore',
  DELETE_BACKUP_REQUEST:    'velero.io.deletebackuprequest',
  DOWNLOAD_REQUEST:         'velero.io.downloadrequest',
  SERVER_STATUS_REQUEST:    'velero.io.serverstatusrequest',
  BACKUP_REPOSITORY:        'velero.io.backuprepository',
  DATA_DOWNLOAD:            'velero.io.datadownload',
  DATA_UPLOAD:              'velero.io.dataupload',
};

export function init($plugin: IPlugin, store: any) {
  const {
    product,
    configureType,
    basicType,
  } = $plugin.DSL(store, PRODUCT_NAME);

  product({
    icon:                'backup',
    inStore:             'cluster',
    weight:              75,
    showNamespaceFilter: true,
  });

  configureType(VELERO_TYPES.BACKUP, {
    displayName: 'Backups',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.RESTORE, {
    displayName: 'Restores',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.SCHEDULE, {
    displayName: 'Schedules',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.BACKUP_STORAGE_LOCATION, {
    displayName: 'Backup Storage Locations',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION, {
    displayName: 'Volume Snapshot Locations',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.POD_VOLUME_BACKUP, {
    displayName: 'Pod Volume Backups',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.POD_VOLUME_RESTORE, {
    displayName: 'Pod Volume Restores',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.DELETE_BACKUP_REQUEST, {
    displayName: 'Delete Backup Requests',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.DOWNLOAD_REQUEST, {
    displayName: 'Download Requests',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.SERVER_STATUS_REQUEST, {
    displayName: 'Server Status Requests',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.BACKUP_REPOSITORY, {
    displayName: 'Backup Repositories',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.DATA_DOWNLOAD, {
    displayName: 'Data Downloads',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  configureType(VELERO_TYPES.DATA_UPLOAD, {
    displayName: 'Data Uploads',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    namespaced:  true,
  });

  basicType([
    VELERO_TYPES.BACKUP,
    VELERO_TYPES.RESTORE,
    VELERO_TYPES.SCHEDULE,
  ]);

  basicType([
    VELERO_TYPES.BACKUP_STORAGE_LOCATION,
    VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION,
    VELERO_TYPES.BACKUP_REPOSITORY,
  ], 'Storage');

  basicType([
    VELERO_TYPES.POD_VOLUME_BACKUP,
    VELERO_TYPES.POD_VOLUME_RESTORE,
    VELERO_TYPES.DATA_DOWNLOAD,
    VELERO_TYPES.DATA_UPLOAD,
  ], 'Operations');

  basicType([
    VELERO_TYPES.DELETE_BACKUP_REQUEST,
    VELERO_TYPES.DOWNLOAD_REQUEST,
    VELERO_TYPES.SERVER_STATUS_REQUEST,
  ], 'Requests');
}
