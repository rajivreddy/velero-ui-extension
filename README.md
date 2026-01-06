# Rancher Velero Extension

A Rancher UI Extension for managing [Velero](https://velero.io/) backup and restore operations directly from the Rancher Dashboard.

## Features

- **Dashboard**: Overview of Velero resources with status counts and quick actions
- **Backup Management**: Create, view, and manage backups with a user-friendly form
- **Restore Operations**: Restore from backups with namespace mapping support
- **Schedule Management**: Create and manage backup schedules with cron presets
- **Storage Locations**: Configure backup and volume snapshot storage locations
- **Namespace Filtering**: Filter resources by namespace
- **YAML Editing**: Edit any resource directly as YAML

## Supported Velero CRDs

| CRD | Description |
|-----|-------------|
| Backup | Create and manage cluster backups |
| Restore | Restore from existing backups |
| Schedule | Automated backup schedules |
| BackupStorageLocation | S3, Azure, GCP storage configuration |
| VolumeSnapshotLocation | Volume snapshot provider configuration |
| PodVolumeBackup | File system backup status |
| PodVolumeRestore | File system restore status |
| DeleteBackupRequest | Backup deletion requests |
| DownloadRequest | Backup download requests |
| ServerStatusRequest | Velero server status |
| BackupRepository | Backup repository information |
| DataDownload | Data download operations |
| DataUpload | Data upload operations |

## Requirements

- Rancher v2.10.0 or later
- Velero installed in the target cluster(s)
- UI Extensions enabled in Rancher

## Installation

### From Helm Repository (Recommended)

1. In Rancher UI, go to **Apps** → **Repositories**
2. Click **Create** and add:
   - **Name**: `velero-ui-extension-extension`
   - **Index URL**: `https://<your-org>.github.io/<your-repo>`
3. Go to **Extensions** → **Available**
4. Find **Rancher Velero** and click **Install**

### From Extension Catalog Image (Air-gapped)

1. In Rancher UI, go to **Extensions**
2. Click the three-dot menu → **Manage Extension Catalog**
3. Click **Import Extension Catalog**
4. Enter the image: `ghcr.io/rajivreddy/velero-ui-extension/velero-ui-extension:<version>`

## Development

### Prerequisites

- Node.js >= 20
- Yarn
- Rancher Dashboard running in development mode

### Setup

```bash
# Clone the repository
git clone https://github.com/<your-org>/velero-ui-extension.git
cd velero-ui-extension

# Install dependencies
yarn install

# Build the extension
yarn build-pkg velero-ui-extension

# Serve the extension for development
yarn serve-pkgs
```

### Load in Rancher

1. Enable developer load in Rancher: Navigate to Extensions and enable Developer Load
2. Enter: `http://127.0.0.1:4500/velero-ui-extension-0.1.0/velero-ui-extension-0.1.0.umd.min.js`

## Publishing

### Prerequisites

1. Create a `gh-pages` branch:
   ```bash
   git checkout --orphan gh-pages
   git reset --hard
   git commit --allow-empty -m "Initialize gh-pages"
   git push origin gh-pages
   git checkout main
   ```

2. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Set **Source** to **GitHub Actions**

### Release Helm Chart

To publish the extension as a Helm chart:

1. Update the version in `pkg/velero-ui-extension/package.json`
2. Create a new GitHub Release with a tag matching: `velero-ui-extension-<version>`
   - Example: `velero-ui-extension-0.1.0`, `velero-ui-extension-1.0.0`
3. The GitHub Action will automatically build and publish to the `gh-pages` branch

**Tag Format**: `<pkg-folder-name>-<version>`

### Release Extension Catalog Image (ECI)

To publish the extension as an ECI for air-gapped environments:

1. Update the version in the root `package.json`
2. Create a new GitHub Release with a tag matching: `velero-ui-extension-extension-<version>`
   - Example: `velero-ui-extension-extension-0.1.0`
3. The GitHub Action will automatically build and push to `ghcr.io`

**Tag Format**: `<root-package-name>-<version>`

### Manual Publishing

```bash
# Build Helm charts and assets
yarn publish-pkgs -s "rajivreddy/velero-ui-extension" -b "gh-pages"

# Build Extension Catalog Image
yarn publish-pkgs -c -p -r ghcr.io -o rajivreddy
```

## Consuming the Extension

### Via Helm Repository

After publishing, add the Helm repository URL to Rancher:

```
https://rajivreddy.github.io/<repo>
```

The extension will appear in **Extensions** → **Available**.

### Via Extension Catalog Image

Import the ECI in Rancher:

```
ghcr.io/rajivreddy/velero-ui-extension/velero-ui-extension:<version>
```

## Project Structure

```
velero-ui-extension/
├── .github/
│   └── workflows/
│       ├── build-extension-charts.yml  # Helm chart publishing
│       └── build-extension-catalog.yml # ECI publishing
├── pkg/
│   └── velero-ui-extension/
│       ├── index.ts                    # Extension entry point
│       ├── product.ts                  # Product registration
│       ├── package.json                # Extension metadata
│       ├── detail/                     # Detail view components
│       ├── edit/                       # Edit/Create form components
│       ├── list/                       # List view components
│       ├── models/                     # Resource models
│       ├── pages/                      # Dashboard page
│       ├── routing/                    # Vue routes
│       └── l10n/                       # Translations
└── package.json                        # Root package (for ECI)
```

## License

Apache 2.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
