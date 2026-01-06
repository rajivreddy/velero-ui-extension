import { IPlugin } from '@shell/core/types';

const PRODUCT_NAME = 'velero';
const DASHBOARD_PAGE = 'dashboard';

// Velero CRD type identifiers (following Rancher naming convention: group.resource)
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
    virtualType,
    basicType,
  } = $plugin.DSL(store, PRODUCT_NAME);

  // Register as cluster-level product (appears in each cluster's navigation)
  // Weight is set low (-1) to position it at the bottom before "More Resources"
  product({
    icon:                'backup',
    inStore:             'cluster',  // This makes it appear in each cluster tab
    weight:              75,
    showNamespaceFilter: true,       // Enable namespace filtering for Velero resources
    to:                  {
      name:   `c-cluster-${ PRODUCT_NAME }-${ DASHBOARD_PAGE }`,
      params: { product: PRODUCT_NAME },
    },
  });

  // Create a virtual type for the dashboard page
  virtualType({
    labelKey: 'velero.dashboard',
    label:    'Dashboard',
    name:     DASHBOARD_PAGE,
    route:    {
      name:   `c-cluster-${ PRODUCT_NAME }-${ DASHBOARD_PAGE }`,
      params: { product: PRODUCT_NAME },
    },
  });

  // Configure each Velero CRD type with display options and custom routes
  // All Velero resources are namespaced (typically in 'velero' namespace)
  configureType(VELERO_TYPES.BACKUP, {
    displayName: 'Backups',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.BACKUP,
      },
    },
  });

  configureType(VELERO_TYPES.RESTORE, {
    displayName: 'Restores',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.RESTORE,
      },
    },
  });

  configureType(VELERO_TYPES.SCHEDULE, {
    displayName: 'Schedules',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.SCHEDULE,
      },
    },
  });

  configureType(VELERO_TYPES.BACKUP_STORAGE_LOCATION, {
    displayName: 'Backup Storage Locations',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.BACKUP_STORAGE_LOCATION,
      },
    },
  });

  configureType(VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION, {
    displayName: 'Volume Snapshot Locations',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION,
      },
    },
  });

  configureType(VELERO_TYPES.POD_VOLUME_BACKUP, {
    displayName: 'Pod Volume Backups',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.POD_VOLUME_BACKUP,
      },
    },
  });

  configureType(VELERO_TYPES.POD_VOLUME_RESTORE, {
    displayName: 'Pod Volume Restores',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.POD_VOLUME_RESTORE,
      },
    },
  });

  configureType(VELERO_TYPES.DELETE_BACKUP_REQUEST, {
    displayName: 'Delete Backup Requests',
    isCreatable: true,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.DELETE_BACKUP_REQUEST,
      },
    },
  });

  configureType(VELERO_TYPES.DOWNLOAD_REQUEST, {
    displayName: 'Download Requests',
    isCreatable: true,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.DOWNLOAD_REQUEST,
      },
    },
  });

  configureType(VELERO_TYPES.SERVER_STATUS_REQUEST, {
    displayName: 'Server Status Requests',
    isCreatable: true,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.SERVER_STATUS_REQUEST,
      },
    },
  });

  configureType(VELERO_TYPES.BACKUP_REPOSITORY, {
    displayName: 'Backup Repositories',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.BACKUP_REPOSITORY,
      },
    },
  });

  configureType(VELERO_TYPES.DATA_DOWNLOAD, {
    displayName: 'Data Downloads',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.DATA_DOWNLOAD,
      },
    },
  });

  configureType(VELERO_TYPES.DATA_UPLOAD, {
    displayName: 'Data Uploads',
    isCreatable: false,
    isEditable:  false,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ PRODUCT_NAME }-resource`,
      params: {
        product:  PRODUCT_NAME,
        resource: VELERO_TYPES.DATA_UPLOAD,
      },
    },
  });

  // Register basic types for side navigation
  // First group: Core Velero resources
  basicType([
    DASHBOARD_PAGE,
    VELERO_TYPES.BACKUP,
    VELERO_TYPES.RESTORE,
    VELERO_TYPES.SCHEDULE,
  ]);

  // Second group: Storage Configuration
  basicType([
    VELERO_TYPES.BACKUP_STORAGE_LOCATION,
    VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION,
    VELERO_TYPES.BACKUP_REPOSITORY,
  ], 'Storage');

  // Third group: Operations
  basicType([
    VELERO_TYPES.POD_VOLUME_BACKUP,
    VELERO_TYPES.POD_VOLUME_RESTORE,
    VELERO_TYPES.DATA_DOWNLOAD,
    VELERO_TYPES.DATA_UPLOAD,
  ], 'Operations');

  // Fourth group: Requests
  basicType([
    VELERO_TYPES.DELETE_BACKUP_REQUEST,
    VELERO_TYPES.DOWNLOAD_REQUEST,
    VELERO_TYPES.SERVER_STATUS_REQUEST,
  ], 'Requests');
}
