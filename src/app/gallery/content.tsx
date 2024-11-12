'use client'

import { galleryDriveFolderId } from '@/config'
import { css, keyframes } from '@emotion/react'
import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Suspense } from 'react'
import Menu from '@/components/Menu'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { listDriveImages, DriveImageFile, buildDriveImageThumbnailUrl, buildDriveImageUrl } from './utils'
import { Loader } from './loader'

const useStyles = () => {
  return useMemo(() => {
    const fadeIn = keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `

    return {
      container: css`
        position: relative;
        background-color: #000;
        min-height: 100lvh;
      `,
      containerInner: css`
        min-height: 100%;
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
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        overflow: hidden;
        width: auto;
        height: 360px;

        img {
          animation: ${fadeIn} 1s ease-in-out 0s forwards;
          opacity: 0;
          display: block;
          background-color: #fff;
        }

        @media (max-width: 430px) {
          width: 100%;
          height: auto;

          img {
            width: 100%;
          }
        }
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

        img {
          max-width: 100%;
          max-height: 100%;
          display: block;
          animation: ${fadeIn} 0.5s ease-in-out 0s forwards;
        }
      `,
    }
  }, [])
}

type ImageFile = {
  id: string
  url1x: string
  url2x: string
  name: string
  aspectRatio: number
}

const driveImageFileToImageFile = (driveImageFile: DriveImageFile): ImageFile => {
  return {
    id: driveImageFile.id,
    url1x: buildDriveImageThumbnailUrl(driveImageFile.id, 'h360'),
    url2x: buildDriveImageThumbnailUrl(driveImageFile.id, 'h720'),
    name: driveImageFile.name,
    aspectRatio: driveImageFile.imageMediaMetadata.width / driveImageFile.imageMediaMetadata.height,
  }
}

const GalleryThumbnail = ({ image }: { image: ImageFile }) => {
  const styles = useStyles()
  const [containerWidth, setContainerWidth] = useState<string | undefined>(undefined)
  const [containerHeight, setContainerHeight] = useState<string | undefined>(undefined)
  const containerRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const mediaQueryList = window.matchMedia('(max-width: 430px)')
      const isNarrow = mediaQueryList.matches
      const container = containerRef.current

      if (!container || !container.parentElement) {
        return
      }

      const computedStyle = getComputedStyle(container.parentElement)

      if (isNarrow) {
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        const marginX = parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight)

        setContainerWidth(undefined)
        setContainerHeight(`${(container.parentElement.clientWidth - paddingX - marginX) / image.aspectRatio}px`)
      } else {
        setContainerWidth(`${360 * image.aspectRatio}px`)
        setContainerHeight(undefined)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [image])

  useEffect(() => {
    const abortController = new AbortController()
    const img = new Image()

    img.src = image.url1x
    img.srcset = `${image.url1x} 1x, ${image.url2x} 2x`
    img.alt = image.name

    const append = () => {
      if (!containerRef.current) {
        return
      }

      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(img)
    }

    if (img.complete) {
      append()

      return
    }

    img.onload = () => {
      if (abortController.signal.aborted) {
        return
      }

      append()
    }

    return () => {
      abortController.abort('The component is unmounted')
    }
  }, [image])

  return (
    <Link
      ref={containerRef}
      css={styles.thumbnail}
      style={{ width: containerWidth, height: containerHeight }}
      href={`?id=${image.id}`}
    />
  )
}

const GalleryThumbnails = () => {
  const styles = useStyles()
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const abortController = new AbortController()
    const startAt = Date.now()

    listDriveImages(galleryDriveFolderId, { abortController })
      .then(async (files) => {
        if (abortController.signal.aborted) {
          return
        }

        const elapsed = Date.now() - startAt
        const timeout = Math.max(1000 - elapsed, 0)

        await new Promise((resolve) => setTimeout(resolve, timeout))

        setImages(files.map(driveImageFileToImageFile))
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)

        if (abortController.signal.aborted) {
          return
        }

        setImages([])
        setIsLoading(false)
      })

    return () => {
      abortController.abort('The component is unmounted')
    }
  }, [])

  return (
    <div css={styles.thumbnailContainer}>
      {isLoading ? <Loader /> : images.map((image) => <GalleryThumbnail key={image.id} image={image} />)}
    </div>
  )
}

const GalleryImage = ({ imageId }: { imageId: string }) => {
  const styles = useStyles()

  const [isFull, setIsFull] = useState(false)
  const containerInnerRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback<React.MouseEventHandler>((e) => {
    e.preventDefault()
    setIsFull((prev) => !prev)
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    const img = new Image()

    img.src = buildDriveImageUrl(imageId)

    const append = () => {
      if (!containerInnerRef.current) {
        return
      }

      containerInnerRef.current.innerHTML = ''
      containerInnerRef.current.appendChild(img)
    }

    if (img.complete) {
      append()

      return
    }

    img.onload = () => {
      if (abortController.signal.aborted) {
        return
      }

      append()
    }

    return () => {
      abortController.abort('The component is unmounted')
    }
  }, [imageId])

  return (
    <div css={styles.imageContainer} style={{ height: isFull ? '100%' : '100lvh' }}>
      <button ref={containerInnerRef} css={styles.imageContainerInner} onClick={handleClick} />
    </div>
  )
}

const GalleryContentInner = () => {
  const styles = useStyles()
  const searchParams = useSearchParams()
  const imageId = searchParams.get('id')

  return <div css={styles.containerInner}>{imageId ? <GalleryImage imageId={imageId} /> : <GalleryThumbnails />}</div>
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
