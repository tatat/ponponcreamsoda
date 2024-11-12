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

export const listDriveImages = async (folderId: string, options?: ListOptions): Promise<DriveImageFile[]> => {
  const files = await listDriveFiles(folderId, options)

  return files.filter((file): file is DriveImageFile => file.mimeType.startsWith('image/'))
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
  abortController?: AbortController
}

export const getDriveImageFileUrl = async (id: string, options?: GetOptions): Promise<string> => {
  const query = new URLSearchParams({
    key: firebaseConfig.apiKey,
    alt: 'media',
  })

  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?${query.toString()}`
  const response = await fetch(url, { signal: options?.abortController?.signal })

  if (!response.ok) {
    console.error(response)

    throw new Error('Failed to fetch file')
  }

  const blob = await response.blob()
  const objectURL = URL.createObjectURL(blob)

  return objectURL
}
