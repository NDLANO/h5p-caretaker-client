# H5P Caretaker client
Reference implementation of a JavaScript client using the H5P Caretaker library. It will not do anything on its own (!), but it requires the server-side [H5P Caretaker library](https://github.com/ndlano/h5p-caretaker) and a server-side integration, e.g. the [H5P Caretaker server reference implementation](https://github.com/ndlano/h5p-caretaker-server).

## Usage
You can see a fully working example on integrating this client in the the [H5P Caretaker server reference implementation](https://github.com/ndlano/h5p-caretaker-server).

### Instantiazation
Load the `h5p-caretaker-client-*.js` file from the dist folder and `h5p-caretaker-client-*.css` file from the dist folder, e.g. with amending your HTML page's `head` with

```
  <link rel="stylesheet" href="node_modules/@explorendla/h5p-caretaker-client/dist/@explorendla/h5p-caretaker-client-1.0.0.css" />
  <script type="module" src="node_modules/@explorendla/h5p-caretaker-client/dist/@explorendla/h5p-caretaker-client-1.0.0.js"></script>
```
The exact path will depend on your setup, of course. Also note that the version number will need to be set in the path
if you do not have set up some auto-retrieval anyway.

In your HTML page, you will need 4 things:
1. an element bearing the class name `h5p-caretaker` to scope the caretaker elements.
2. a child element bearing the class name `dropzone` that will be filled with the dropzone for uploading files and
3. a child element bearing the class name `filter-tree` that will be filled with the filter for choosing contents and
4. a child element bearing the class name `output` that will be filled with the reports.
5. a tiny piece of JavaScript that runs the H5PCaretaker and passes the upload endpoint at least.

So, assuming that `./upload.php` is your endpoint, a very basic setup in the `<body>` could be

```
<div class="h5p-caretaker">
  <div class="dropzone"></div>
  <div class="filter-tree"></div>
  <div class="output">
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  new H5PCaretaker({ endpoint: './upload.php' });
});
</script>
```
You will have to take care of additional styling yourself.

### Session key
Your platform may support session keys that can/need to be set in the form in order to prevent
cross-site request forgery. You can pass the session key name (`sessionKeyName`) and the session key value (`sessionKeyValue`) to the
constructor, and they will be passed to the request.

_Example for moodle (to satisfy `require_sesskey()`)_
```
<script>
document.addEventListener('DOMContentLoaded', () => {
  new H5PCaretaker({
    // endpoint and other parameters here, too
    sessionKeyName: 'sesskey', // `sesskey` is what moodle uses
    sessionKeyValue: '<Value returned by moodle's PHP `sesskey()`>'
  });
});
</script>
```

### Localization
The client expects the constructor to be passed an `l10n` object holding key-value pairs for translatable strings. The values should be the desired translation for strings that the client uses. If not set, the client will fall back to the English defaults.

_Example for English (despite being default anyway)_
```
<script>
document.addEventListener('DOMContentLoaded', () => {
  new H5PCaretaker({
    // endpoint and other parameters here, too
    l10: {
      orDragTheFileHere: 'or drag the file here',
      removeFile: 'Remove file',
      selectYourLanguage: 'Select your language',
      uploadProgress: 'Upload progress',
      uploadYourH5Pfile: 'Upload your H5P file',
      yourFileIsBeingChecked: 'Your file is being checked',
      yourFileWasCheckedSuccessfully: 'Your file was checked successfully',
      totalMessages: 'Total messages',
      issues: 'issues',
      results: 'results',
      filterBy: 'Filter by',
      groupBy: 'Group by',
      download: 'Download',
      expandAllMessages: 'Expand all messages',
      collapseAllMessages: 'Collapse all messages',
      allFilteredOut: 'All messages have been filtered out by content.',
      reportTitleTemplate: 'H5P Caretaker report for @title',
      contentFilter: 'Content type filter',
      showAll: 'Show all',
      showSelected: 'Various selected contents',
      showNone: 'Show none',
      filterByContent: 'Filter by content:',
      reset: 'Reset',
    }
  });
});
</script>
```

If you wish, you can implement your own language selection as seen in the reference server implementation.

### Callbacks
The 2nd constructor argument is reserved for callback functions that you may want to be called when certain things happen. H5P Caretaker currently supports these:
- _onInitialized_: Called when initialization is done.
- _onUploadStarted_: Called when the file upload starts.
- _onUploadEnded_: Called when the file upload ended. Will return `true` if successful, else `false`.
- _onReset_: Called when the user resets the client.

Given that, the instantiazitaton could e.g. look like:
```
<script>
document.addEventListener('DOMContentLoaded', () => {
  new H5PCaretaker(
    {
      // endpoint and other parameters here
    },
    {
      onInitialized: () => {
        // Do something after initialization
      },
      onUploadEnded: (wasSuccessful) => {
        // Do something after the upload ended depending on the value of `wasSuccessful`
      }
    }
  });
});
</script>
```

## Future Development
Will at some point learn to edit fields and to send requests to the integration to save them to an H5P file.

