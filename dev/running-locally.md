# Running Locally

This document describes the recommended development run for `npm-gui-next`.

## Ports

- API server: `3002`
- Parcel dev client: default Parcel port, typically `1234`

The frontend proxies `/api/*` requests to `http://localhost:3002` through [.proxyrc.json](/mnt/c/git-public/npm-gui-next/.proxyrc.json).

## Recommended Environment

For this repository, prefer one of these:

- native Windows from the real Windows path
- WSL from the Linux filesystem, for example `~/src/npm-gui-next`

Avoid running installs from a Windows-mounted path inside WSL such as `/mnt/c/...`, because npm bin-link permissions can fail there.

## Install

From the repository root:

```bash
npm install
```

If you want to validate Bun support locally, also install Bun on the machine and confirm:

```bash
bun --version
```

## Start The API Server

In terminal 1:

```bash
npm run dev:server
```

This starts the server on:

```text
http://localhost:3002
```

## Start The Client

In terminal 2:

```bash
npm run dev:client
```

Parcel will print the client URL, usually:

```text
http://localhost:1234
```

Open that client URL in the browser to test the UI.

## Windows PowerShell Example

```powershell
cd C:\path\to\npm-gui-next
npm install
```

Terminal 1:

```powershell
cd C:\path\to\npm-gui-next
npm run dev:server
```

Terminal 2:

```powershell
cd C:\path\to\npm-gui-next
npm run dev:client
```

## Troubleshooting

- `ENOENT Could not read package.json`
  You are not in the repository root. Change into the repo folder first.
- npm permission or `EPERM` errors under WSL on `/mnt/c/...`
  Move the repo to the Linux filesystem or run the project directly from Windows.
- Client starts but API requests fail
  Check that the server is running on port `3002`.
- Bulk install modal shows `Request Error`
  Open the modal row details and the browser console. The client now surfaces normalized server error payloads, including command output in `details` when available.
- Bun manager options do not appear
  Bun support is availability-driven. If `bun --version` fails on the host, the Bun reinstall option and Bun test coverage are skipped.
