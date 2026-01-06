<script>
import { VELERO_TYPES } from '../product';

export default {
  name: 'VeleroDashboard',

  data() {
    return {
      backupCount:    0,
      restoreCount:   0,
      scheduleCount:  0,
      loading:        true,
      schemasFound:   {},
      error:          null,
    };
  },

  async fetch() {
    try {
      const store = this.$store;
      
      // Check if Velero schemas are available in the cluster
      const backupSchema = store.getters['cluster/schemaFor'](VELERO_TYPES.BACKUP);
      const restoreSchema = store.getters['cluster/schemaFor'](VELERO_TYPES.RESTORE);
      const scheduleSchema = store.getters['cluster/schemaFor'](VELERO_TYPES.SCHEDULE);
      
      this.schemasFound = {
        backup:   !!backupSchema,
        restore:  !!restoreSchema,
        schedule: !!scheduleSchema,
      };
      
      // Only fetch if schemas are available (Velero is installed)
      const promises = [];
      
      if (backupSchema) {
        promises.push(
          store.dispatch('cluster/findAll', { type: VELERO_TYPES.BACKUP })
            .then(backups => { this.backupCount = backups?.length || 0; })
        );
      }
      
      if (restoreSchema) {
        promises.push(
          store.dispatch('cluster/findAll', { type: VELERO_TYPES.RESTORE })
            .then(restores => { this.restoreCount = restores?.length || 0; })
        );
      }
      
      if (scheduleSchema) {
        promises.push(
          store.dispatch('cluster/findAll', { type: VELERO_TYPES.SCHEDULE })
            .then(schedules => { this.scheduleCount = schedules?.length || 0; })
        );
      }
      
      await Promise.all(promises);
    } catch (e) {
      console.error('Error fetching Velero resources:', e);
      this.error = e.message || 'Failed to fetch Velero resources';
    } finally {
      this.loading = false;
    }
  },
  
  computed: {
    veleroInstalled() {
      return this.schemasFound.backup || this.schemasFound.restore || this.schemasFound.schedule;
    },
  },
};
</script>

<template>
  <div class="velero-dashboard">
    <h1 class="dashboard-title">
      <i class="icon icon-backup" /> Velero Dashboard
    </h1>
    <p class="dashboard-description">
      Velero is an open source tool to safely backup and restore, perform disaster recovery, and migrate Kubernetes cluster resources and persistent volumes.
    </p>

    <div v-if="loading" class="loading">
      Loading Velero resources...
    </div>

    <div v-else-if="error" class="error-banner">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>
    
    <div v-else-if="!veleroInstalled" class="not-installed-banner">
      <h2>Velero Not Detected</h2>
      <p>Velero CRDs were not found in this cluster. Please ensure Velero is installed.</p>
      <p>To install Velero, follow the <a href="https://velero.io/docs/main/basic-install/" target="_blank" rel="noopener">official installation guide</a>.</p>
    </div>

    <div v-else class="dashboard-cards">
      <div class="card">
        <div class="card-header">
          <h3>Backups</h3>
        </div>
        <div class="card-body">
          <div class="count">
            {{ backupCount }}
          </div>
          <p>Total backups in cluster</p>
        </div>
        <div class="card-footer">
          <router-link :to="{ name: 'c-cluster-velero-resource', params: { cluster: $route.params.cluster, resource: 'velero.io.backup' } }">
            View All Backups →
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Restores</h3>
        </div>
        <div class="card-body">
          <div class="count">
            {{ restoreCount }}
          </div>
          <p>Total restores in cluster</p>
        </div>
        <div class="card-footer">
          <router-link :to="{ name: 'c-cluster-velero-resource', params: { cluster: $route.params.cluster, resource: 'velero.io.restore' } }">
            View All Restores →
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Schedules</h3>
        </div>
        <div class="card-body">
          <div class="count">
            {{ scheduleCount }}
          </div>
          <p>Active backup schedules</p>
        </div>
        <div class="card-footer">
          <router-link :to="{ name: 'c-cluster-velero-resource', params: { cluster: $route.params.cluster, resource: 'velero.io.schedule' } }">
            View All Schedules →
          </router-link>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-buttons">
        <router-link
          :to="{ name: 'c-cluster-velero-resource-create', params: { cluster: $route.params.cluster, resource: 'velero.io.backup' } }"
          class="btn role-primary"
        >
          Create Backup
        </router-link>
        <router-link
          :to="{ name: 'c-cluster-velero-resource-create', params: { cluster: $route.params.cluster, resource: 'velero.io.restore' } }"
          class="btn role-secondary"
        >
          Create Restore
        </router-link>
        <router-link
          :to="{ name: 'c-cluster-velero-resource-create', params: { cluster: $route.params.cluster, resource: 'velero.io.schedule' } }"
          class="btn role-secondary"
        >
          Create Schedule
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.velero-dashboard {
  padding: 20px;

  .dashboard-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .icon {
      font-size: 28px;
    }
  }

  .dashboard-description {
    color: var(--text-muted);
    margin-bottom: 30px;
  }

  .loading {
    padding: 40px;
    text-align: center;
    color: var(--text-muted);
  }

  .error-banner {
    padding: 20px;
    background: var(--error-bg, #fce4e4);
    border: 1px solid var(--error-border, #f5aca6);
    border-radius: var(--border-radius);
    margin-bottom: 30px;
    color: var(--error, #c0392b);
  }

  .not-installed-banner {
    padding: 30px;
    background: var(--warning-bg, #fef9e7);
    border: 1px solid var(--warning-border, #f7dc6f);
    border-radius: var(--border-radius);
    margin-bottom: 30px;
    text-align: center;

    h2 {
      color: var(--warning, #d68910);
      margin-bottom: 15px;
    }

    p {
      margin-bottom: 10px;
    }

    a {
      color: var(--link);
    }
  }

  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .card {
    background: var(--box-bg);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    overflow: hidden;

    .card-header {
      background: var(--header-bg);
      padding: 15px 20px;
      border-bottom: 1px solid var(--border);

      h3 {
        margin: 0;
      }
    }

    .card-body {
      padding: 20px;
      text-align: center;

      .count {
        font-size: 48px;
        font-weight: bold;
        color: var(--primary);
      }

      p {
        color: var(--text-muted);
        margin-top: 10px;
      }
    }

    .card-footer {
      padding: 15px 20px;
      border-top: 1px solid var(--border);
      text-align: center;

      a {
        color: var(--link);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .quick-actions {
    h2 {
      margin-bottom: 15px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      border-radius: var(--border-radius);
      text-decoration: none;
      font-weight: 500;
    }

    .role-primary {
      background: var(--primary);
      color: var(--primary-text);
    }

    .role-secondary {
      background: var(--default);
      color: var(--body-text);
      border: 1px solid var(--border);
    }
  }
}
</style>
