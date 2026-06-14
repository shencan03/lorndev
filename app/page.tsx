import Image from 'next/image'
import bebop from '@/public/rainbow-bebop.gif'

export default function Home() {

  return (
    <>
      <div className='hidden sm:block z-[-1] opacity-40 sm:static'>
        <Image
          src={bebop}
          alt="GIF of cowboy bebop as background image"
          fill
          quality={75}
          style={{maskImage: 'linear-gradient(to bottom, black, transparent)'}}
        />
      </div>
      <main className="grid grid-cols-1 sm:grid-cols-2">
        <article className="grid gap-4 mx-12">
          <h1 className="text-6xl underline underline-offset-3">Why bother making this website?</h1>
          <p className="max-w-md text-2xl py-6">I am having trouble finding ways to express myself, I am not a musician nor an artist, I am a software developer and at that an amateur at best. But still, I thought it&apos;s worth giving it a shot as a means to express my thoughts, my taste in various things and my <i>skills</i> in web development.</p>
        </article>
      </main>
    </>
  )
}