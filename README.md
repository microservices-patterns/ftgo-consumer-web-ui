# FTGO Consumer Web UI

## Installation

### `npm install`

Installs all dependencies

## Application Scripts

### `npm test`

Launches a test runner in a non-interactive single-threaded mode. <br />
Use `JEST_JUNIT_OUTPUT_DIR` environment var in order to set up a directory for test-runner output consumable by CI.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.<br />
The build folder is ready to be deployed. If run by a Circle CI, the contents of the folder are packed and the resulting archive is stored under the **Artifacts** tab. You can download and unpack it.

You may serve the contents of this folder with a static server:

```shell
npm install -g serve  # if 'serve' is not installed
serve -s build  # assuming the folder is called "build"
```

When the `serve` command is run, the following output will inform you of how to view the web application:

```

   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:5000      │
   │   - On Your Network:  http://192.168.0.23:5000   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
   
```
