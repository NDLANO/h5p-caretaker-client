# H5P Caretaker client
Reference implementation of a JavaScript client using the H5P Caretaker library. It will not do anything on its own (!), but it requires the server-side [H5P Caretaker library](https://github.com/ndlano/h5p-caretaker) and a server-side integration, e.g. the [H5P Caretaker server reference implementation](https://github.com/ndlano/h5p-caretaker-server).

## Usage
You can see a fully working example on integrating this client in the the [H5P Caretaker server reference implementation](https://github.com/ndlano/h5p-caretaker-server).

### Instantiazitation
Just load the `h5p-caretaker-client-*.js` file from the dist folder and `h5p-caretaker-client-*.css` file from the dist folder, e.g. with amending your HTML page's `head` with

```
  <link rel="stylesheet" href="node_modules/h5p-caretaker-client/dist/h5p-caretaker-client-1.0.0.css" />
  <script type="module" src="node_modules/h5p-caretaker-client/dist/node_modules/h5p-caretaker-client/dist/h5p-caretaker-client-1.0.0.css"></script>
```
The exact path will depend on your setup, of course.

In your HTML page, you will need 4 things:
1. an element bearing the class name `h5p-caretaker` and the attribute `data-upload-endpoint` pointing to the endpoint that will be used for uploading H5P files and
2. a child element bearing the class name `dropzone` that will be filled with the dropzone for uploading files and
3. a child element bearing the class name `filter-tree` that will be filled with the filter for choosing contents and
4. a child element bearing the class name `output` that will be filled with the reports.

So, assuming that `./upload.php` is your endpoint, a very basic setup could be 
```
<div class="h5p-caretaker" data-upload-endpoint="./upload.php">
  <div class="dropzone"></div>
  <div class="filter-tree"></div>
  <div class="output">
</div>
```
You will have to take care of additional styling yourself.

### Localization
The client expects `window.H5P_CARETAKER_L10N` to be an object holding key-value pairs for translatable strings. The values should be the desired translation for strings that the client uses. If not set, the client will fall back to the English defaults.

_Example for English (despite being default anyway)_
```
window.H5P_CARETAKER_L10N = {
  orDragTheFileHere: "or drag the file here",
  removeFile: "Remove file",
  selectYourLanguage: "Select your language",
  uploadProgress: "Upload progress",
  uploadYourH5Pfile: "Upload your H5P file",
  yourFileIsBeingChecked: "Your file is being checked",
  yourFileWasCheckedSuccessfully: "Your file was checked successfully",
  totalMessages: "Total messages",
  issues: "issues",
  results: "results",
  filterBy: "Filter by",
  groupBy: "Group by",
  download: "Download",
  expandAllMessages: "Expand all messages",
  collapseAllMessages: "Collapse all messages",
  allFilteredOut: "All messages have been filtered out by content.",
  reportTitleTemplate: "H5P Caretaker report for @title",
  contentFilter: "Content type filter",
  showAll: "Show all",
  showSelected: "Various selected contents",
  showNone: "Show none",
  filterByContent: "Filter by content:",
  reset: "Reset",
}
```

If you wish, you can implement your own language selection as seen in the reference server implementation.

## Future Development
Will at some point learn to edit fields and to send requests to the integration to save them to an H5P file.

