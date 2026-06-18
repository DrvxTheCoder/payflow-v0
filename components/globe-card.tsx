import { Globe } from "@/components/ui/globe"
import { WordRotate } from "./ui/word-rotate"
import { TextLoop } from "./motion-primitives/text-loop";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

export function GlobeDemo() {
  return (
    <div className="bg-background relative flex flex-col size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border px-2 pt-10 md:pt-15 pb-40 md:pb-60">
        <Button className="absolute inline-flex z-100 right-5 top-45 rounded-full bg-black text-white hover:bg-neutral-800">
          Learn more
          <ArrowUpRight className="size-4" />
        </Button>
        <span className="w-full pointer-events-none bg-linear-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl md:text-3xl leading-none font-extrabold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
          {"Payflow is now global."}
        </span>
      {/* <div className="flex flex-row justify-items-center gap-0 transition-all ease-in-out">
        <span className="w-full pointer-events-none text-muted-foreground text-center text-base md:text-lg font-bold whitespace-pre-wrap">
          {"Send & receive from "}
        </span>
        <WordRotate className="text-lime-600 text-base md:text-lg font-bold" words={["Canada", "Senegal", "USA", "France", "Spain", "the UK", "Nigeria"]} />
      </div> */}
      <CountryTextLoop />
      <Globe className="top-20 md:top-15" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  )
}

export function GlobeDemoContrast() {
  return (
    <div className="bg-[#ebbd57] relative flex flex-col size-full w-full items-center justify-center overflow-hidden rounded-2xl border px-2 pt-10 md:pt-15 pb-40 md:pb-60">
        <Button className="absolute inline-flex z-100 right-5 top-45 rounded-full bg-black text-white hover:bg-neutral-800">
          Learn more
          <ArrowUpRight className="size-4" />
        </Button>
        <span className="w-full pointer-events-none 
              text-black
               text-center text-2xl md:text-3xl leading-none font-extrabold whitespace-pre-wrap ">
          {"Payflow is now global."}
        </span>
      {/* <div className="flex flex-row justify-items-center gap-0 transition-all ease-in-out">
        <span className="w-full pointer-events-none text-muted-foreground text-center text-base md:text-lg font-bold whitespace-pre-wrap">
          {"Send & receive from "}
        </span>
        <WordRotate className="text-lime-600 text-base md:text-lg font-bold" words={["Canada", "Senegal", "USA", "France", "Spain", "the UK", "Nigeria"]} />
      </div> */}
      <CountryTextLoopContrast />
      <Globe className="top-20 md:top-15" />
    </div>
  )
}

function CountryTextLoop() {
  return (
    <span className='flex flex-row justify-items-center whitespace-pre-wrap text-base md:text-lg font-medium'>
      Send & receive money from{' '}
      <TextLoop
        className='overflow-y-clip text-[#ebbd57] font-extrabold'
        transition={{
          type: 'spring',
          stiffness: 900,
          damping: 80,
          mass: 10,
        }}
        variants={{
          initial: {
            y: -20,
            rotateX: 90,
            opacity: 0,
            filter: 'blur(4px)',
          },
          animate: {
            y: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px)',
          },
          exit: {
            y: 20,
            rotateX: -90,
            opacity: 0,
            filter: 'blur(4px)',
          },
        }}
      >
        <span>Canada</span>
        <span>Senegal</span>
        <span>the USA</span>
        <span>France</span>
        <span>Spain</span>
        <span>the UK</span>
        <span>Nigeria</span>
      </TextLoop>
    </span>
  );
}

function CountryTextLoopContrast() {
  return (
    <span className='flex flex-row justify-items-center whitespace-pre-wrap text-base md:text-lg font-medium text-white'>
      Send & receive money from{' '}
      <TextLoop
        className='overflow-y-clip text-black font-extrabold'
        transition={{
          type: 'spring',
          stiffness: 900,
          damping: 80,
          mass: 10,
        }}
        variants={{
          initial: {
            y: -20,
            rotateX: 90,
            opacity: 0,
            filter: 'blur(4px)',
          },
          animate: {
            y: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px)',
          },
          exit: {
            y: 20,
            rotateX: -90,
            opacity: 0,
            filter: 'blur(4px)',
          },
        }}
      >
        <span>Canada</span>
        <span>Senegal</span>
        <span>the USA</span>
        <span>France</span>
        <span>Spain</span>
        <span>the UK</span>
        <span>Nigeria</span>
      </TextLoop>
    </span>
  );
}
