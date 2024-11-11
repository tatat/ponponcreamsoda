'use client'

import { galleryDriveFolderId } from '@/config'
import { css } from '@emotion/react'
import { useMemo, useState, useEffect } from 'react'
import { Suspense } from 'react'
import Menu from '@/components/Menu'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { listDriveImages, DriveFile, buildDriveImageThumbnailUrl, buildDriveImageUrl } from './utils'

const useStyles = () => {
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

        @media (max-width: 430px) {
          width: 100%;
        }
      `,
      thumbnailImage: css`
        width: 100%;
      `,
      imageContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        min-height: 100lvh;
        box-sizing: border-box;
      `,
      image: css`
        max-width: 100%;
      `,
    }
  }, [])
}

type ImageFile = {
  id: string
  url: string
  name: string
}

const driveFileToImageFile = (driveFile: DriveFile): ImageFile => {
  return {
    id: driveFile.id,
    url: buildDriveImageThumbnailUrl(driveFile.id, 'h360'),
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
                <img css={styles.thumbnailImage} src={image.url} alt={image.name} title={image.name} />
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

  return (
    <div css={styles.imageContainer}>
      <img css={styles.image} src={imageUrl} alt={imageId} />
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
