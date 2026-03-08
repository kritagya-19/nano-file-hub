

## File Preview Feature

### Overview
Add an in-browser file preview modal that supports images, PDFs, and text files, with navigation between files using arrow keys and buttons.

### New Component: `src/components/files/FilePreviewModal.tsx`
A dialog-based modal viewer that:
- Accepts the current file list, selected file index, and an `onClose` callback
- Fetches a signed URL via `getFileUrl` for the selected file
- Renders content based on MIME type:
  - **Images** (`image/*`): `<img>` tag with object-fit contain
  - **PDFs** (`application/pdf`): `<iframe>` embed
  - **Text files** (`text/*`, `.json`, `.xml`, `.csv`, `.md`): Fetch content via signed URL and render in a `<pre>` block with syntax styling
  - **Unsupported types**: Show a message with a download button
- Left/Right arrow navigation buttons + keyboard arrow key support
- File name, size, and type shown in the header
- Download button in the header
- Loading spinner while fetching URL/content
- Responsive: full-screen on mobile, max-w-5xl on desktop

### Changes to `src/pages/Files.tsx`
- Add state: `previewFileIndex: number | null`
- Add `handlePreviewFile(file)` that finds the file index in `filteredFiles` and sets it
- Make file cards/rows clickable (onClick → open preview)
- Add "Preview" option in dropdown menus
- Render `<FilePreviewModal>` when `previewFileIndex !== null`
- Pass `getFileUrl` and `handleDownloadFile` to the modal

### Changes to `src/hooks/useFiles.ts`
No changes needed — `getFileUrl` already provides signed URLs.

### Interaction Design
- Click file card → opens preview
- Folder clicks still navigate into folders (unchanged)
- Arrow keys / prev-next buttons cycle through files only (skip folders)
- Escape key closes modal
- Download button in preview header

