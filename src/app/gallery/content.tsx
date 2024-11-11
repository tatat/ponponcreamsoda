'use client'

import { galleryDriveFolderId } from '@/config'
import { css, useTheme } from '@emotion/react'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { Suspense } from 'react'
import Menu from '@/components/Menu'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { listDriveImages, DriveFile, buildDriveImageThumbnailUrl, buildDriveImageUrl } from './utils'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => {
    return {
      container: css`
        position: relative;
        background-color: #000;
        min-height: 100lvh;
      `,
      containerInner: css`
        min-height: 100%;
      `,
      loading: css`
        ${theme.styles.text};
        color: #fff;
      `,
      thumbnailContainer: css`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 10px;
        padding: 10px;
        min-height: 100lvh;
        box-sizing: border-box;
      `,
      thumbnail: css`
        position: relative;
        display: block;

        @media (max-width: 430px) {
          width: 100%;
        }
      `,
      thumbnailImage: css`
        width: 100%;
        display: block;
      `,
      imageContainer: css`
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        overflow: auto;
      `,
      imageContainerInner: css`
        display: block;
        border-style: none;
        background-color: transparent;
        cursor: pointer;
        height: 100%;
        padding: 0;
        margin: 0;
      `,
      image: css`
        max-width: 100%;
        max-height: 100%;
        display: block;
      `,
    }
  }, [theme])
}

type ImageFile = {
  id: string
  url1x: string
  url2x: string
  name: string
}

const driveFileToImageFile = (driveFile: DriveFile): ImageFile => {
  return {
    id: driveFile.id,
    url1x: buildDriveImageThumbnailUrl(driveFile.id, 'h360'),
    url2x: buildDriveImageThumbnailUrl(driveFile.id, 'h720'),
    name: driveFile.name,
  }
}

const GalleryThumbnails = () => {
  const styles = useStyles()
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const abortController = new AbortController()

    listDriveImages(galleryDriveFolderId, { abortController })
      .then((files) => {
        if (abortController.signal.aborted) {
          return
        }

        setImages(files.map(driveFileToImageFile))
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)
      })

    return () => {
      abortController.abort('The component is unmounted')
    }
  }, [])

  return (
    <div css={styles.thumbnailContainer}>
      {isLoading
        ? <div css={styles.loading}>Loading...</div>
        : images.map((image) => {
            return (
              <Link css={styles.thumbnail} key={image.id} href={`?id=${image.id}`}>
                <img
                  css={styles.thumbnailImage}
                  src={image.url1x}
                  srcSet={`${image.url1x} 1x, ${image.url2x} 2x`}
                  alt={image.name}
                  title={image.name}
                />
              </Link>
            )
          })
        }
    </div>
  )
}

const GalleryImage = ({ imageId }: { imageId: string }) => {
  const styles = useStyles()
  const imageUrl = buildDriveImageUrl(imageId)
  const [isFull, setIsFull] = useState(false)

  const handleClick = useCallback<React.MouseEventHandler>((e) => {
    e.preventDefault()
    setIsFull((prev) => !prev)
  }, [])

  return (
    <div css={styles.imageContainer} style={{ height: isFull ? '100%' : '100lvh' }}>
      <button css={styles.imageContainerInner} onClick={handleClick}>
        <img
          css={styles.image}
          src={imageUrl}
          alt={imageId}
        />
      </button>
    </div>
  )
}

const GalleryContentInner = () => {
  const styles = useStyles()
  const searchParams = useSearchParams()
  const imageId = searchParams.get('id')

  return (
    <div css={styles.containerInner}>
      {imageId
        ? <GalleryImage imageId={imageId} />
        : <GalleryThumbnails />
      }
    </div>
  )
}

export default function GalleryContent() {
  const styles = useStyles()

  return (
    <div css={styles.container}>
      <Menu />
      <Suspense>
        <GalleryContentInner />
      </Suspense>
    </div>
  )
}
