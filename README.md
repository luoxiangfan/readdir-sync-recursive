# readdir-sync-recursive
Reads the contents of the directory synchronously and recursively.

Like `fs.readdirSync('/path/source', { recursive: true })`.Compatible with lower versions of nodejs.

Return `[]` if the path not exist or not a directory

## Installation

```js
npm install @lxf2513/readdir-sync-recursive
```

## Usage

```js
import readdirSyncRecursive from '@lxf2513/readdir-sync-recursive'

readdirSyncRecursive('/path/source')

readdirSyncRecursive('/path/source', 'relativePath')

readdirSyncRecursive('/path/source', 'absolutePath')
```