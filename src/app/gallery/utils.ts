import { firebaseConfig } from '@/config'

export type DriveFile = {
  kind: string
  id: string
  name: string
  mimeType: string
} & Record<string, unknown>

export type DriveImageFile = {
  kind: string
  id: string
  name: string
  mimeType: string
  imageMediaMetadata: {
    width: number
    height: number
    rotation: number
  } & Record<string, unknown>
}

export type DriveFileList = {
  nextPageToken?: string
  kind: string
  incompleteSearch: boolean
  files: DriveFile[]
}

export type ListOptions = {
  pageToken?: string
  abortController?: AbortController
}

export const listDriveFiles = async (folderId: string, options?: ListOptions): Promise<DriveFile[]> => {
  const query = new URLSearchParams({
    key: firebaseConfig.apiKey,
    q: `"${folderId}" in parents`,
    trashed: 'false',
    orderBy: 'name,modifiedTime desc,createdTime desc',
    fields: 'nextPageToken,files(kind,id,name,mimeType,imageMediaMetadata),kind,incompleteSearch',
  })

  if (options?.pageToken) {
    query.set('pageToken', options.pageToken)
  }

  const url = `https://www.googleapis.com/drive/v3/files?${query.toString()}`
  const response = await fetch(url, { signal: options?.abortController?.signal })

  if (!response.ok) {
    console.error(response)

    throw new Error('Failed to fetch files')
  }

  const data: DriveFileList = await response.json()

  if (data.nextPageToken) {
    if (options?.abortController?.signal.aborted) {
      return data.files
    }

    const nextPageFiles = await listDriveFiles(folderId, {
      pageToken: data.nextPageToken,
      abortController: options?.abortController,
    })

    return [...data.files, ...nextPageFiles]
  }

  return data.files
}

const _driveImageListCache = {
  createdAt: 0,
  data: [] as DriveImageFile[],
}

export const listDriveImages = async (
  folderId: string,
  options?: ListOptions & { cacheTtl?: number },
): Promise<DriveImageFile[]> => {
  const cacheTtl = options?.cacheTtl ?? 1000 * 60 * 5
  const cacheExpiredAt = _driveImageListCache.createdAt + cacheTtl

  if (Date.now() < cacheExpiredAt) {
    console.log('[listDriveImages] cache hit')

    return _driveImageListCache.data
  }

  const files = await listDriveFiles(folderId, options)
  const data = files.filter((file): file is DriveImageFile => file.mimeType.startsWith('image/'))

  _driveImageListCache.createdAt = Date.now()
  _driveImageListCache.data = data

  return data
}

export const buildDriveImageThumbnailUrl = (id: string, size?: string): string => {
  const query = new URLSearchParams({
    id,
  })

  if (size) {
    query.set('sz', size)
  }

  return `https://drive.google.com/thumbnail?${query.toString()}`
}

export const buildDriveImageUrl = (id: string): string => {
  return `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}`
}

export type GetOptions = {
  fallback?: boolean
  abortController?: AbortController
}

const _driveImageThumbnailCache: Record<string, string | undefined> = {}

export const getDriveImageThumbnailUrl = async (id: string, options?: GetOptions): Promise<string> => {
  const cache = _driveImageThumbnailCache[id]

  if (cache) {
    console.log('[getDriveImageThumbnailUrl] cache hit:', id)

    return cache
  }

  const query = new URLSearchParams({
    key: firebaseConfig.apiKey,
    fields: 'thumbnailLink',
  })

  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?${query.toString()}`
  const response = await (async () => {
    try {
      return await fetch(url, {
        signal: options?.abortController?.signal,
      })
    } catch (error) {
      console.error(error)

      return null
    }
  })()

  if (response == null || !response.ok) {
    console.error({ response })

    if (options?.fallback === true) {
      return buildDriveImageUrl(id)
    }

    throw new Error('Failed to fetch thumbnail')
  }

  const data = await response.json()
  const thumbnailUrl = data.thumbnailLink.replace(/=s\d+$/, '=s0')

  _driveImageThumbnailCache[id] = thumbnailUrl

  return thumbnailUrl
}

const _driveImageFileCache: Record<string, string | undefined> = {}

// NOTE: alt=media frequently fails to fetch the file
export const getDriveImageFileUrl = async (id: string, options?: GetOptions): Promise<string> => {
  const cache = _driveImageFileCache[id]

  if (cache) {
    console.log('[getDriveImageFileUrl] cache hit:', id)

    return cache
  }

  const query = new URLSearchParams({
    key: firebaseConfig.apiKey,
    alt: 'media',
  })

  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?${query.toString()}`
  const response = await (async () => {
    try {
      return await fetch(url, {
        signal: options?.abortController?.signal,
      })
    } catch (error) {
      console.error(error)

      return null
    }
  })()

  if (response == null || !response.ok) {
    console.error({ response })

    if (options?.fallback === true) {
      return getDriveImageThumbnailUrl(id, options)
    }

    throw new Error('Failed to fetch file')
  }

  const blob = await response.blob()
  const objectURL = URL.createObjectURL(blob)

  _driveImageFileCache[id] = objectURL

  return objectURL
}

export const nextTick = async <T>(
  func: () => T | Promise<T>,
  abortController?: AbortController,
): Promise<T | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 0))

  if (abortController?.signal.aborted) {
    return
  }

  return func()
}
