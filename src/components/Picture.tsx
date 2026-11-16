import lqipData from '../content/image-lqip.json';

const IMAGES = {
  profile: { width: 1320, height: 2306, widths: [480, 760, 1080] },
  'athlete-front-double': { width: 1320, height: 2211, widths: [480, 760, 1080] },
  'athlete-side': { width: 1320, height: 2249, widths: [480, 760, 1080] },
  'athlete-front-lat': { width: 891, height: 1600, widths: [480, 760] },
} as const;

export type ImageName = keyof typeof IMAGES;

const lqip = lqipData as Record<string, string>;

type PictureProps = {
  name: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
  position?: string;
};

export function Picture({
  name,
  alt,
  sizes,
  className = '',
  eager = false,
  position = '50% 50%',
}: PictureProps) {
  const meta = IMAGES[name];
  const srcSet = meta.widths.map((width) => `/images/${name}-${width}.webp ${width}w`).join(', ');

  return (
    <picture className={`media ${className}`.trim()}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`/images/${name}.jpg`}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        style={{ backgroundImage: `url(${lqip[name]})`, objectPosition: position }}
        ref={(element) => {
          if (element?.complete) element.classList.add('is-loaded');
        }}
        onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
      />
    </picture>
  );
}
